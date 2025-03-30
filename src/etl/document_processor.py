import os
import re
from typing import Optional
from pyspark.sql import SparkSession, DataFrame
from pyspark.sql import functions as F


class DocumentProcessor:
    """Processes TREC documents to create mappings from document IDs to file paths."""
    
    def __init__(self, docs_directory: str, output_path: Optional[str] = None):
        """Initialize document processor.
        
        Args:
            docs_directory: Directory containing TREC document files
            output_path: Optional path to save the document paths mapping
        """
        self.docs_directory = docs_directory
        self.output_path = output_path
        
    def generate_doc_paths(self, spark: SparkSession) -> DataFrame:
        """Generate document ID to file path mapping.
        
        Args:
            spark: SparkSession instance
            
        Returns:
            DataFrame containing document IDs and their file paths
        """
        # Create a mapping function that will be used with RDD
        def process_file(filename):
            doc_id_map = {}
            try:
                with open(filename, 'r', encoding='latin1') as f:
                    data = f.read()
                    doc_id_matches = re.findall(r'<DOCNO>\s*(.*?)\s*</DOCNO>', data)
                    for doc_id in doc_id_matches:
                        doc_id_map[doc_id.strip()] = filename
            except Exception as e:
                print(f"Error processing file {filename}: {e}")
            return list(doc_id_map.items())
        
        # List all files in the directory recursively
        file_paths = []
        for dirpath, _, files in os.walk(self.docs_directory):
            for filename in files:
                file_paths.append(os.path.join(dirpath, filename))
        
        print(f"Found {len(file_paths)} files to process in {self.docs_directory}")
        
        # Create RDD from file paths and process them
        file_paths_rdd = spark.sparkContext.parallelize(file_paths)
        doc_paths_rdd = file_paths_rdd.flatMap(process_file)
        
        # Convert RDD to DataFrame
        doc_paths_df = doc_paths_rdd.toDF(["doc_id", "doc_path"])
        
        # Print document count
        doc_count = doc_paths_df.count()
        print(f"Found {doc_count} document IDs across all files")
        
        # Save if output path is provided
        if self.output_path:
            # Define spark output path (with _spark suffix)
            spark_output_path = f"{self.output_path}_spark"
            
            # Save distributed Spark output
            doc_paths_df.write.option('header', False).csv(spark_output_path)
            
            # Create directory for consolidated file if it doesn't exist
            os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
            
            # Save as a single CSV file
            doc_paths_df.toPandas().to_csv(self.output_path, index=False, header=False)
        
        return doc_paths_df

    @staticmethod
    def extract_document_text(file_path: str, doc_id: str) -> str:
        """Extract document text from a file using the document ID, using exactly the same approach as in functions.py.
        
        Args:
            file_path: Path to the file containing the document
            doc_id: Document ID to extract
            
        Returns:
            Extracted document text
        """
        try:
            with open(file_path, 'r', encoding='latin1') as file:
                data = file.read()

                full_doc_matches = re.search(r'<DOC>\s*<DOCNO>\s*{}\s*</DOCNO>\s*(.*?)\s*</DOC>'.format(doc_id), data, re.DOTALL)
                full_doc = full_doc_matches.group(1).strip() if full_doc_matches else None

                if full_doc:
                    headline_match = re.search(r'(<(?:HEADLINE|HEADER)>.*?</(?:HEADLINE|HEADER)>)(.*)', full_doc, re.DOTALL)
                    if headline_match:
                        text_content = headline_match.group(1) + headline_match.group(2)
                    else:
                        text_content = full_doc

                    cleaned_text_parts = re.findall(r'>([^<]+)<', text_content)
                    cleaned_text = ' '.join(part.strip() for part in cleaned_text_parts if part.strip())

                    return cleaned_text
                return ""
        except Exception as e:
            print(f"ERROR in extract_document_text for {doc_id} from {file_path}: {e}")
            return "" 