from typing import Optional
from dataclasses import dataclass
from pyspark.sql import SparkSession
import os

from sampling import Sampling
from document_processor import DocumentProcessor
from topic_parser import TopicParser
from prompt_generator import PromptGenerator
from kafka_producer import KafkaProducer

@dataclass
class ETLConfig:
    """Configuration for the ETL pipeline."""
    
    # Spark configuration
    spark_app_name: str = "TREC-Prompt-ETL"
    spark_master: str = "local[*]"
    spark_driver_memory: str = "4g"
    spark_executor_memory: str = "4g"
    spark_memory_fraction: float = 0.8
    spark_memory_storage_fraction: float = 0.3
    spark_shuffle_partitions: int = 100
    
    # Checkpoint directory
    checkpoint_dir: str = "/tmp/spark_checkpoint"
    
    # Memory optimization
    gc_interval: int = 1000  # GC every N tasks
    
    # Sampling configuration
    sampling_output_path: Optional[str] = None
    
    # Document processing configuration
    docs_directory: str = "/data/raw/robust04/disks"
    doc_paths_output_path: Optional[str] = None
    
    # Topic parsing configuration
    topics_path: str = "/data/raw/robust04/topics.301-450.601-700.trec.txt"
    
    # Prompt generation configuration
    prompts_output_path: Optional[str] = None
    
    # Kafka configuration
    kafka_bootstrap_servers: str = "kafka:9092"
    kafka_topic: str = "prompts"
    kafka_checkpoint_location: Optional[str] = None
    send_to_kafka: bool = False


class ETLPipeline:
    """Main ETL pipeline for processing TREC documents and generating prompts."""
    
    def __init__(self, config: ETLConfig, sampling_strategy: Sampling):
        """Initialize ETL pipeline.
        
        Args:
            config: ETL configuration
            sampling_strategy: Sampling strategy to use
        """
        self.config = config
        self.sampling_strategy = sampling_strategy
        self.spark = None
    
    def initialize_spark(self) -> None:
        """Initialize Spark session."""
        # Create checkpoint directory if it doesn't exist
        os.makedirs(self.config.checkpoint_dir, exist_ok=True)
        
        # Build the Spark session with optimized memory settings
        self.spark = SparkSession.builder \
            .appName(self.config.spark_app_name) \
            .master(self.config.spark_master) \
            .config("spark.driver.memory", self.config.spark_driver_memory) \
            .config("spark.executor.memory", self.config.spark_executor_memory) \
            .config("spark.memory.fraction", self.config.spark_memory_fraction) \
            .config("spark.memory.storageFraction", self.config.spark_memory_storage_fraction) \
            .config("spark.sql.shuffle.partitions", self.config.spark_shuffle_partitions) \
            .config("spark.submit.pyFiles", "etl/document_processor.py,etl/prompt_generator.py") \
            .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.1.2") \
            .config("spark.driver.maxResultSize", "2g") \
            .config("spark.kryoserializer.buffer.max", "1g") \
            .config("spark.sql.adaptive.enabled", "true") \
            .config("spark.sql.adaptive.coalescePartitions.enabled", "true") \
            .config("spark.cleaner.periodicGC.interval", f"{self.config.gc_interval}") \
            .config("spark.rdd.compress", "true") \
            .config("spark.sql.autoBroadcastJoinThreshold", "10m") \
            .config("spark.sql.files.maxPartitionBytes", "128m") \
            .config("spark.sql.files.openCostInBytes", "1048576") \
            .config("spark.speculation", "true") \
            .getOrCreate()
        
        # Set checkpoint directory
        self.spark.sparkContext.setCheckpointDir(self.config.checkpoint_dir)
    
    def run(self) -> None:
        """Run the complete ETL pipeline."""
        if self.spark is None:
            self.initialize_spark()
        
        try:
            # Set additional runtime configurations
            self.spark.conf.set("spark.sql.broadcastTimeout", 1800)
            self.spark.conf.set("spark.sql.execution.arrow.pyspark.enabled", "true")
            
            print("Starting ETL pipeline...")
            print(f"Memory config: Driver={self.config.spark_driver_memory}, Executor={self.config.spark_executor_memory}")
            
            # Step 1: Perform sampling
            print("Step 1: Performing sampling...")
            samples_df = self.sampling_strategy.sample(self.spark)
            
            # Cache the result to avoid recomputation
            samples_df.cache()
            count = samples_df.count()
            print(f"Sampled {count} documents")
            
            # Checkpoint to break lineage and avoid OOM during shuffles
            samples_df = samples_df.checkpoint(eager=True)
            
            # Step 2: Generate document paths
            print("Step 2: Generating document paths...")
            doc_processor = DocumentProcessor(
                self.config.docs_directory,
                self.config.doc_paths_output_path
            )
            doc_paths_df = doc_processor.generate_doc_paths(self.spark)
            
            # Cache and checkpoint to optimize memory usage
            doc_paths_df.cache()
            doc_count = doc_paths_df.count()
            print(f"Generated paths for {doc_count} documents")
            doc_paths_df = doc_paths_df.checkpoint(eager=True)
            
            # Step 3: Parse topics
            print("Step 3: Parsing topics...")
            topic_parser = TopicParser(self.config.topics_path)
            topics_df = topic_parser.parse_topics_to_dataframe(self.spark)
            
            # Cache the result to avoid recomputation
            topics_df.cache()
            topic_count = topics_df.count()
            print(f"Parsed {topic_count} topics")
            
            # Checkpoint to break lineage and avoid OOM
            topics_df = topics_df.checkpoint(eager=True)
            
            # Step 4: Generate prompts
            print("Step 4: Generating prompts...")
            try:
                prompt_generator = PromptGenerator(self.config.prompts_output_path)
                prompts_df = prompt_generator.generate_prompts(
                    self.spark,
                    samples_df,
                    topics_df,
                    doc_paths_df
                )
                
                # Checkpoint result to prevent recomputation
                if prompts_df.count() > 0:
                    prompts_df = prompts_df.checkpoint(eager=True)
                    
            except Exception as e:
                print(f"Error in prompt generation: {e}")
                # Create empty dataframe with expected schema
                prompts_df = self.spark.createDataFrame(
                    [], 
                    "query_id STRING, doc_id STRING, relevance STRING, prompt STRING"
                )
            
            # Step 5: Send to Kafka if configured
            if self.config.send_to_kafka and prompts_df.count() > 0:
                try:
                    print("Step 5: Sending prompts to Kafka...")
                    kafka_producer = KafkaProducer(
                        bootstrap_servers=self.config.kafka_bootstrap_servers,
                        topic=self.config.kafka_topic,
                        checkpoint_location=self.config.kafka_checkpoint_location
                    )
                    kafka_producer.send_batch(self.spark, prompts_df)
                except Exception as e:
                    print(f"Error sending to Kafka: {e}")
            
            # Unpersist cached DataFrames to free memory
            samples_df.unpersist()
            doc_paths_df.unpersist()
            topics_df.unpersist()
            
            print("ETL pipeline completed successfully!")
            return prompts_df
            
        except Exception as e:
            print(f"Error in ETL pipeline: {e}")
            raise
        finally:
            if self.spark:
                print("Stopping Spark session...")
                self.spark.stop() 