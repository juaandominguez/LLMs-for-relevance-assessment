from typing import Dict, List, Tuple
import pandas as pd
import numpy as np
import json
from datetime import datetime

from sklearn.metrics import mean_absolute_error, cohen_kappa_score
from utils.functions import calculate_auc

from utils.logging import get_logger
from models.assessors.factory import AssessorFactory, AssessorType

from core.config import Config

logger = get_logger()
start_time = datetime.now().strftime("%Y%m%d_%H%M%S")

class MetricsCalculator:
    @staticmethod
    def calculate_custom_kappa(y_true: List[int], y_pred: List[int]) -> float:
        if len(y_true) != len(y_pred):
            raise ValueError("Length of y_true and y_pred must be the same")
        if len(y_true) == 0:
            return 1.0

        total = len(y_true)
        y_true = np.array(y_true)
        y_pred = np.array(y_pred)

        tp = np.sum((y_true == 1) & (y_pred == 1))
        fn = np.sum((y_true == 1) & (y_pred == 0))
        tn = np.sum((y_true == 0) & (y_pred == 0))
        fp = np.sum((y_true == 0) & (y_pred == 1))

        print(f'| {tp} | {fn} |\n| {fp} | {tn} |')

        p0 = np.sum(y_true == y_pred) / total
        p_true = np.bincount(y_true) / total
        p_pred = np.bincount(y_pred) / total
        pe = np.sum(p_true * p_pred)

        return (p0 - pe) / (1 - pe)

class AssessmentProcessor:
    def __init__(self, config: Config, assessor_type: AssessorType = AssessorType.LLAMA):
        self.assessor = AssessorFactory.create_assessor(assessor_type)
        self.config = config

    def process_prompts(self) -> Dict:
        prompt_df = pd.read_json(self.config.prompts_path, lines=True)
        assessments = {}
        
        for idx, (prompt, relevance, query_id, doc_id) in enumerate(prompt_df.to_numpy(), 1):
            logger.info(f"Processing line {idx}", flush=True)
            try:
                response = self.assessor.assess(prompt, relevance)
                if response is not None:
                    if query_id not in assessments:
                        assessments[query_id] = {}
                    assessments[query_id][doc_id] = {
                        'response': int(response > 0),
                        'relevance': int(relevance > 0)
                    }
                else:
                    logger.warning(f"No response for prompt {idx}")
            except Exception as e:
                logger.error(f"Error in response generation for prompt {idx}: {e}")
                
        return assessments

class ResultWriter:
    def __init__(self, config: Config, timestamp):
        self.config = config
        self.timestamp = timestamp

    def write_results(self, assessments: Dict) -> None:
        responses, relevances = self._extract_responses_and_relevances(assessments)
        
        if not responses:
            logger.error("No responses obtained")
            exit(1)

        metrics = self._calculate_metrics(responses, relevances, assessments)
        
        responses_array = []
        for query_id in assessments:
            for doc_id in assessments[query_id]:
                responses_array.append({
                    'query_id': query_id,
                    'doc_id': doc_id,
                    'response': assessments[query_id][doc_id]['response'],
                    'relevance': assessments[query_id][doc_id]['relevance']
                })

        json_output = {
            'timestamp': self.timestamp,
            'metrics': {
                'mae': metrics['mae'],
                'kappa': metrics['kappa'],
                'custom_kappa': metrics['custom_kappa'],
                'auc': metrics['auc']
            },
            'assessments': responses_array
        }
        
        with open(self.config.json_output_pattern, 'w') as f:
            json.dump(json_output, f, indent=2)
        logger.success(f"Results saved to: {self.config.json_output_pattern}")

    def _extract_responses_and_relevances(self, assessments: Dict) -> Tuple[List, List]:
        responses = [assessments[query_id][doc_id]['response'] 
                    for query_id in assessments 
                    for doc_id in assessments[query_id]]
        relevances = [assessments[query_id][doc_id]['relevance'] 
                     for query_id in assessments 
                     for doc_id in assessments[query_id]]
        return responses, relevances

    def _calculate_metrics(self, responses: List, relevances: List, assessments: Dict) -> Dict:
        return {
            'mae': mean_absolute_error(relevances, responses),
            'kappa': cohen_kappa_score(relevances, responses),
            'custom_kappa': MetricsCalculator.calculate_custom_kappa(relevances, responses),
            'auc': calculate_auc(assessments, self.config.qrel_path)
        }

def main():
    logger.info("Starting Inference...", flush=True)
    config = Config(
        prompts_path='data/processed/prompts.jsonl',
        qrel_path='data/processed/stratified_sampling_pairs.csv',
        json_output_pattern='data/processed/inferences/inference_{start_time}.json'
    )

    processor = AssessmentProcessor(config, AssessorType.LLAMA)
    writer = ResultWriter(config, start_time)
    
    assessments = processor.process_prompts()
    writer.write_results(assessments)

if __name__ == "__main__":
    main()