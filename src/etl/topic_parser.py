import re
from typing import Dict, Optional
from pyspark.sql import SparkSession, DataFrame
import pyspark.sql.functions as F
from pyspark.sql.types import StructType, StructField, StringType


class TopicParser:
    """Parses TREC topics and extracts query, description, and narrative fields."""
    
    def __init__(self, topics_path: str):
        """Initialize topic parser.
        
        Args:
            topics_path: Path to the TREC topics file
        """
        self.topics_path = topics_path
        
    def parse_topics(self) -> Dict[str, Dict[str, str]]:
        """Parse topics into a dictionary format using the exact same approach as in functions.py.
        
        Returns:
            Dictionary mapping query IDs to their components (query, description, narrative)
        """
        topics_dict = {}
        
        with open(self.topics_path, 'r') as file:
            content = file.read()
            
            # Split into individual topics
            topics = re.split(r'(?=<top>)', content)
            topics = [topic for topic in topics if topic.strip()]
            
            for topic in topics:
                # Extract topic information exactly as in functions.py
                num_match = re.search(r'<num>\s*Number:\s*(\d+)', topic)
                title_match = re.search(r'<title>\s*(.*?)\s*(?=<desc>)', topic, re.DOTALL)
                desc_match = re.search(r'<desc>\s*(Description:)?\s*(.*?)\s*(?=<narr>)', topic, re.DOTALL)
                narr_match = re.search(r'<narr>\s*(Narrative:)?\s*(.*?)\s*</top>', topic, re.DOTALL)
                
                num = num_match.group(1).strip() if num_match else None
                title = title_match.group(1).strip() if title_match else None
                desc = desc_match.group(2).strip().replace('\n', ' ') if desc_match else None
                narr = narr_match.group(2).strip().replace('\n', ' ') if narr_match else None
                
                if num:
                    topics_dict[num] = {
                        'query': title,
                        'description': desc,
                        'narrative': narr
                    }
                
        return topics_dict
    
    def parse_topics_to_dataframe(self, spark: SparkSession) -> DataFrame:
        """Parse topics and convert to a Spark DataFrame.
        
        Args:
            spark: SparkSession instance
            
        Returns:
            DataFrame containing topic components
        """
        topics_dict = self.parse_topics()
        
        # Convert to format suitable for creating DataFrame
        topics_rows = []
        for topic_id, topic_info in topics_dict.items():
            topics_rows.append((
                topic_id, 
                topic_info['query'], 
                topic_info['description'], 
                topic_info['narrative']
            ))
        
        # Create Schema
        topics_schema = StructType([
            StructField("topic_id", StringType(), False),
            StructField("query", StringType(), True),
            StructField("description", StringType(), True),
            StructField("narrative", StringType(), True)
        ])
        
        # Create DataFrame
        return spark.createDataFrame(topics_rows, topics_schema) 