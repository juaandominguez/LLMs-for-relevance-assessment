import pandas as pd
from models.assessors.factory import AssessorFactory, AssessorType
from utils.logging import get_logger
from io import StringIO

PROMPTS_PATH = 'data/processed/all_prompts.jsonl'
OUTPUT_FILE = 'data/processed/qrels-by-llm-8b.txt'

assesor = AssessorFactory().create_assessor(AssessorType.LLAMA)
logger = get_logger()

cnt = 0
with open(OUTPUT_FILE, 'a') as f:
    with open(PROMPTS_PATH, 'r') as file:
        for line in file:
            try:
                cnt += 1
                if(cnt <= 268): continue
                df = pd.read_json(StringIO(line), lines=True)
                print(f"Line {cnt}", flush=True)
                prompt = df['prompt'].iloc[0]
                relevance = df['relevance'].iloc[0]
                query_id = df['query_id'].iloc[0]
                doc_id = df['doc_id'].iloc[0]

                response = assesor.assess(prompt, relevance)
                if response is not None:
                    if int(response) >= 2:
                        response = 2
                    f.write(f'{query_id} 0 {doc_id} {response}\n')
                else:
                    f.write(f'{query_id} 0 {doc_id} 0\n')
                    logger.warning(f"Error in response generation for prompt {cnt}")

            except Exception as e:
                logger.error(f"Error in response generation for prompt {cnt}, {e}")