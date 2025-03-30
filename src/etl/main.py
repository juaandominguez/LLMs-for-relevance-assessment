from pipeline import ETLPipeline, ETLConfig
from sampling import StratifiedSampling, PoolingSampling


def main():
    """Run an example ETL pipeline"""
    
    # Create configuration with memory settings and checkpointing
    config = ETLConfig(
        spark_app_name="Stratified-Sampling-Example",
        spark_driver_memory="8g",
        spark_executor_memory="6g",
        spark_memory_fraction=0.8,
        spark_memory_storage_fraction=0.3,
        spark_shuffle_partitions=200,
        docs_directory="data/processed/disks",
        topics_path="data/processed/topics.301-450.601-700.trec.txt",
        doc_paths_output_path="data/processed/etl/doc_paths.csv",
        prompts_output_path="data/processed/etl/prompts_pooling.jsonl",
        send_to_kafka=True
    )
    
    # Create sampling strategy with reduced pooling depth
    sampling_strategy = PoolingSampling(
        runs_path="data/processed/runs",
        qrel_path="data/processed/qrels.robust04.300-450.600-700.trec.txt",
        pooling_depth=100,
        output_path="data/processed/etl/stratified_sampling_pairs.csv"
    )
    
    # Create and run pipeline
    pipeline = ETLPipeline(config, sampling_strategy)
    pipeline.run()


if __name__ == "__main__":
    main()
