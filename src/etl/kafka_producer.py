from typing import Dict, Optional
from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.functions import col, to_json, struct


class KafkaProducer:
    """Streams data to Kafka topics."""
    
    def __init__(self, 
                bootstrap_servers: str = "kafka:9092", 
                topic: str = "prompts", 
                checkpoint_location: Optional[str] = None):
        """Initialize Kafka producer.
        
        Args:
            bootstrap_servers: Kafka bootstrap servers
            topic: Kafka topic to send data to
            checkpoint_location: Optional checkpoint location for streaming
        """
        self.bootstrap_servers = bootstrap_servers
        self.topic = topic
        self.checkpoint_location = checkpoint_location
    
    def send_batch(self, spark: SparkSession, data_df: DataFrame) -> None:
        """Send a batch of data to Kafka.
        
        Args:
            spark: SparkSession instance
            data_df: DataFrame containing data to send
        """
        # Convert DataFrame to JSON format
        json_df = data_df.select(to_json(struct([data_df[x] for x in data_df.columns])).alias("value"))
        
        # Write to Kafka
        json_df.write \
            .format("kafka") \
            .option("kafka.bootstrap.servers", self.bootstrap_servers) \
            .option("topic", self.topic) \
            .save()
    
    def start_streaming(self, spark: SparkSession, data_df: DataFrame) -> None:
        """Start a streaming job to send data to Kafka.
        
        Args:
            spark: SparkSession instance
            data_df: DataFrame containing data to stream
        """
        # Convert DataFrame to JSON format
        json_df = data_df.select(to_json(struct([data_df[x] for x in data_df.columns])).alias("value"))
        
        # Write to Kafka as a stream
        stream_query = json_df.writeStream \
            .format("kafka") \
            .option("kafka.bootstrap.servers", self.bootstrap_servers) \
            .option("topic", self.topic)
        
        if self.checkpoint_location:
            stream_query = stream_query.option("checkpointLocation", self.checkpoint_location)
        
        # Start the streaming query
        stream_query.start().awaitTermination() 