import json
import os
from typing import Dict, List, Optional
from pyspark.sql import SparkSession, DataFrame
import pyspark.sql.functions as F
from pyspark.sql.types import StringType
from document_processor import DocumentProcessor


class PromptGenerator:
    """Generates prompts by combining query information with document text."""
    
    def __init__(self, output_path: Optional[str] = None, template_path: str = "data/raw/prompt_template.txt"):
        """Initialize prompt generator.
        
        Args:
            output_path: Optional path to save the generated prompts
            template_path: Path to the prompt template file
        """
        self.output_path = output_path
        with open(template_path, 'r') as file:
            self.template = file.read()
    
    def process_prompt(self, query: str, description: str, narrative: str, document_text: str) -> str:
        """Format a prompt combining query information with document text, using the same approach as in functions.py.
        
        Args:
            query: Query title
            description: Query description
            narrative: Query narrative
            document_text: Document text to evaluate
            
        Returns:
            Formatted prompt
        """
        try:  
            return self.template.replace('<query>', query or "") \
                              .replace('<description>', description or "") \
                              .replace('<narrative>', narrative or "") \
                              .replace('<document_text>', document_text or "")
        except Exception as e:
            print(f"Error formatting prompt: {e}")
            return f"Error: {str(e)}"
    
    def generate_prompts(self, 
                        spark: SparkSession, 
                        samples_df: DataFrame, 
                        topics_df: DataFrame, 
                        doc_paths_df: DataFrame) -> DataFrame:
        """Generate prompts by combining sampling, topics, and document data.
        
        Args:
            spark: SparkSession instance
            samples_df: DataFrame containing sampled query-document pairs
            topics_df: DataFrame containing topic information
            doc_paths_df: DataFrame containing document path information
            
        Returns:
            DataFrame containing generated prompts
        """
        try:
            spark.conf.set("spark.sql.broadcastTimeout", 3600)
            
            print(f"Samples count: {samples_df.count()}, Topics count: {topics_df.count()}")
            joined_df = samples_df.join(
                F.broadcast(topics_df),
                samples_df["TOPIC"] == topics_df["topic_id"],
                "inner"
            )
            joined_df.cache()
            
            # Join with document paths
            print(f"Joined count: {joined_df.count()}, Doc paths count: {doc_paths_df.count()}")
            joined_df = joined_df.join(
                doc_paths_df,
                joined_df["DOCUMENT"] == doc_paths_df["doc_id"],
                "inner"
            )
            joined_df.cache()
            
            # Repartition if needed to balance work
            partition_count = spark.conf.get("spark.sql.shuffle.partitions")
            print(f"Using {partition_count} partitions")
            if joined_df.rdd.getNumPartitions() < int(partition_count):
                joined_df = joined_df.repartition(int(partition_count))
            
            # Register UDF for document text extraction with error handling
            def extract_doc_text(doc_path, doc_id):
                try:
                    if not doc_path or not doc_id:
                        return ""
                    return DocumentProcessor.extract_document_text(doc_path, doc_id)
                except Exception as e:
                    print(f"Error extracting document text for {doc_id}: {e}")
                    return f"Error: {str(e)}"
            
            extract_text_udf = F.udf(extract_doc_text, StringType())
            
            # Extract document text in batches if the dataset is large
            docs_count = joined_df.count()
            print(f"Processing {docs_count} documents")
            
            if docs_count > 10000:
                # Process in batches to avoid memory issues
                print("Large dataset detected, processing in batches")
                batch_size = 10000
                batches = (docs_count // batch_size) + 1
                
                result_df = None
                for i in range(batches):
                    start = i * batch_size
                    end = min((i + 1) * batch_size, docs_count)
                    print(f"Processing batch {i+1}/{batches} (documents {start}-{end})")
                    
                    batch_df = joined_df.limit(end).subtract(joined_df.limit(start))
                    
                    # Extract document text for this batch
                    batch_df = batch_df.withColumn(
                        "document_text", 
                        extract_text_udf(F.col("doc_path"), F.col("doc_id"))
                    )
                    
                    # Append to result
                    if result_df is None:
                        result_df = batch_df
                    else:
                        result_df = result_df.union(batch_df)
                    
                    # Checkpoint to disk to avoid lineage issues
                    result_df = result_df.checkpoint(eager=True)
            else:
                # For smaller datasets, process all at once
                result_df = joined_df.withColumn(
                    "document_text", 
                    extract_text_udf(F.col("doc_path"), F.col("doc_id"))
                )
            
            # Register UDF for prompt generation
            def format_prompt(query, description, narrative, doc_text):
                try:
                    return self.process_prompt(query, description, narrative, doc_text)
                except Exception as e:
                    print(f"Error formatting prompt: {e}")
                    return f"Error: {str(e)}"
            
            format_prompt_udf = F.udf(format_prompt, StringType())
            
            # Generate prompts
            result_df = result_df.withColumn(
                "prompt",
                format_prompt_udf(
                    F.col("query"),
                    F.col("description"),
                    F.col("narrative"),
                    F.col("document_text")
                )
            )
            
            # Format final result
            result_df = result_df.select(
                F.col("TOPIC").alias("query_id"),
                F.col("DOCUMENT").alias("doc_id"),
                F.col("RELEVANCE").alias("relevance"),
                F.col("prompt")
            )
            
            # Save prompts if output path is provided
            if self.output_path:
                try:
                    # Define spark output paths (with _spark suffix)
                    jsonl_spark_path = f"{self.output_path}_spark/jsonl"
                    
                    # Create directories for output files
                    os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
                    
                    # Convert to JSONL format for Spark output
                    def to_json_line(row):
                        try:
                            return json.dumps({
                                "prompt": row["prompt"],
                                "relevance": row["relevance"],
                                "query_id": row["query_id"],
                                "doc_id": row["doc_id"]
                            })
                        except Exception as e:
                            print(f"Error converting to JSON: {e}")
                            return json.dumps({"error": str(e)})
                    
                    to_json_udf = F.udf(to_json_line, StringType())
                    
                    # Create JSON lines and write directly to partitioned files
                    jsonl_df = result_df.withColumn(
                        "json_line", 
                        to_json_udf(F.struct([result_df[x] for x in result_df.columns]))
                    ).select("json_line")
                    
                    # Write with controlled parallelism
                    print(f"Writing results to {jsonl_spark_path}")
                    jsonl_df.repartition(10).write.mode("overwrite").text(jsonl_spark_path)
                    
                    try:
                        sample_size = min(100, jsonl_df.count())
                        sample_path = f"{self.output_path}.sample"
                        print(f"Writing sample of {sample_size} records to {sample_path}")
                        
                        sample_rows = jsonl_df.limit(sample_size).collect()
                        with open(sample_path, "w") as f:
                            for row in sample_rows:
                                f.write(f"{row['json_line']}\n")
                        
                        print(f"Sample written to {sample_path}")
                        print(f"Full data available in distributed format at {jsonl_spark_path}")
                    except Exception as e:
                        print(f"Warning: Could not write sample file: {e}")
                
                except Exception as e:
                    print(f"Error saving results: {e}")
            
            return result_df
            
        except Exception as e:
            print(f"Error in prompt generation: {e}")
            # Return an empty DataFrame with the expected schema
            empty_data = []
            return spark.createDataFrame(
                empty_data, 
                "query_id STRING, doc_id STRING, relevance STRING, prompt STRING"
            ) 
