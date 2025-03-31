from abc import ABC, abstractmethod
import pandas as pd
import os
from typing import Optional
from pyspark.sql import SparkSession, DataFrame
from pyspark.sql import Window
from pyspark.sql import functions as F


class Sampling(ABC):
    """Abstract base class for document sampling strategies."""
    
    @abstractmethod
    def sample(self, spark: SparkSession) -> DataFrame:
        """Sample documents and return them as a Spark DataFrame.
        
        Args:
            spark: SparkSession instance
            
        Returns:
            DataFrame containing sampled documents
        """
        pass


class StratifiedSampling(Sampling):
    """Implements stratified sampling strategy."""
    
    def __init__(self, qrel_path: str, num_samples: int, output_path: Optional[str] = None):
        """Initialize stratified sampling.
        
        Args:
            qrel_path: Path to the QREL file
            num_samples: Number of samples per relevance group
            output_path: Optional path to save the sampled results
        """
        self.qrel_path = qrel_path
        self.num_samples = num_samples
        self.output_path = output_path
    
    def sample(self, spark: SparkSession) -> DataFrame:
        """Perform stratified sampling based on relevance level.
        
        Args:
            spark: SparkSession instance
            
        Returns:
            DataFrame containing sampled documents
        """
        # Read QREL file
        df = spark.read.csv(self.qrel_path, sep=' ', header=None)
        df = df.toDF("TOPIC", "Q0", "DOCUMENT", "RELEVANCE")
        df = df.drop("Q0")
        
        window = Window.partitionBy("RELEVANCE")
        df = df.withColumn("random", F.rand())
        df = df.withColumn("row_num", F.row_number().over(window.orderBy("random")))
        df = df.filter(F.col("row_num") <= self.num_samples)
        result_df = df.drop("random", "row_num")
        
        if self.output_path:
            try:
                # Create directory for consolidated file if it doesn't exist
                os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
                
                # Save as a partitioned CSV file
                spark_output_path = f"{self.output_path}_spark"
                result_df.repartition(10).write.option('header', False).mode("overwrite").csv(spark_output_path)
                
                try:
                    result_df.toPandas().to_csv(self.output_path, index=False, header=False, sep=' ')
                except Exception as e:
                    print(f"Warning: Could not save consolidated file due to: {e}")
                    print(f"Full data is still available at: {spark_output_path}")
            except Exception as e:
                print(f"Error saving results: {e}")
                
        return result_df


class PoolingSampling(Sampling):
    """Implements pooling-based sampling strategy."""
    
    def __init__(self, runs_path: str, qrel_path: str, pooling_depth: int, output_path: Optional[str] = None):
        """Initialize pooling-based sampling.
        
        Args:
            runs_path: Path to directory containing retrieval runs
            qrel_path: Path to the QREL file
            pooling_depth: Depth for pooling from each run
            output_path: Optional path to save the sampled results
        """
        self.runs_path = runs_path
        self.qrel_path = qrel_path
        self.pooling_depth = pooling_depth
        self.output_path = output_path
    
    def sample(self, spark: SparkSession) -> DataFrame:
        """Perform pooling-based sampling from multiple runs.
        
        Args:
            spark: SparkSession instance
            
        Returns:
            DataFrame containing pooled documents
        """
        # List all run files
        run_files = os.listdir(self.runs_path)
        
        run_dfs = []
        # Process each run file
        for file in run_files:
            file_path = f"{self.runs_path}/{file}"
            df = spark.read.csv(file_path, sep='\t', header=None)
            df = df.toDF("TOPIC", "Q0", "doc_id", "rank", "score", "run_id")
            
            # Keep the rank column for the window operation
            # Take top documents for each query based on pooling depth
            window_spec = Window.partitionBy("TOPIC").orderBy("rank")
            df = df.withColumn("row_number", F.row_number().over(window_spec))
            df = df.filter(F.col("row_number") <= self.pooling_depth)
            
            # Now we can drop rank and row_number, and rename doc_id to DOCUMENT
            df = df.select("TOPIC", F.col("doc_id").alias("DOCUMENT"))
            
            run_dfs.append(df)
        
        # Combine all runs in a memory-efficient way
        pool_df = None
        for df in run_dfs:
            if pool_df is None:
                pool_df = df
            else:
                pool_df = pool_df.unionByName(df, allowMissingColumns=True)
        
        # Remove duplicates
        pool_df = pool_df.distinct()
        
        qrel_df = spark.read.csv(self.qrel_path, sep=' ', header=None)
        qrel_df = qrel_df.toDF("TOPIC", "Q0", "DOCUMENT", "RELEVANCE")
        qrel_df = qrel_df.drop("Q0")
        
        result_df = pool_df.join(F.broadcast(qrel_df), on=["TOPIC", "DOCUMENT"])
        
        if self.output_path:
            try:
                # Create directory for consolidated file if it doesn't exist
                os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
                
                # Save as partitioned CSV files to avoid memory issues
                spark_output_path = f"{self.output_path}_spark"
                result_df.repartition(10).write.option('header', False).mode("overwrite").csv(spark_output_path)
                
                try:
                    result_df.toPandas().to_csv(self.output_path, index=False, header=False, sep=' ')
                except Exception as e:
                    print(f"Warning: Could not save consolidated file due to: {e}")
                    print(f"Full data is still available at: {spark_output_path}")
            except Exception as e:
                print(f"Error saving results: {e}")
            
        return result_df 