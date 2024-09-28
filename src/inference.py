import pandas as pd
from sklearn.metrics import mean_absolute_error, cohen_kappa_score
from utils.functions import parse_response, calculate_auc
from utils.assesor import Assesor, AssesorType

PROMPTS_PATH = 'data/processed/pooling_prompts.jsonl'
QREL_PATH = 'data/processed/pooling_pairs.csv'
OUTPUT_FILE = 'data/processed/results-with-prompts-pooling-8b.txt'
ASSESSOR_TYPE = AssesorType.POSITIVE_ORACLE
assesor = Assesor()

print("Starting Inference...", flush=True)

prompt_df = pd.read_json(PROMPTS_PATH, lines=True)

def get_response(prompt, relevance):
    match ASSESSOR_TYPE:
        case AssesorType.LLAMA:
            return assesor.assess_llama(prompt)
        case AssesorType.RANDOM:
            return assesor.assess_random()
        case AssesorType.POSITIVE_ORACLE:
            return assesor.assess_positive_oracle(relevance)
        case AssesorType.NEGATIVE_ORACLE:
            return assesor.assess_negative_oracle(relevance)
        case _:
            return None

cnt = 0
with open(OUTPUT_FILE, 'w') as f:
    try:
        assesments = {}
        for line in prompt_df.to_numpy():
            cnt += 1
            print(f"Line {cnt}", flush=True)
            prompt, relevance, query_id, doc_id = line
            response = get_response(prompt, relevance)
            f.write(f'Prompt {cnt}: {response}\n\n')

            if response is not None:
                if query_id not in assesments:
                    assesments[query_id] = {}

                assesments[query_id][doc_id] = {
                    'response': int(response > 0),
                    'relevance': int(relevance > 0)
                }
    except Exception as e:
        print(f"Error in response generation for prompt {cnt}, {e}")

    responses = [assesments[query_id][doc_id]['response'] for query_id in assesments for doc_id in assesments[query_id]]

    relevances = [assesments[query_id][doc_id]['relevance'] for query_id in assesments for doc_id in assesments[query_id]]

    if len(responses) == 0:
        print("No responses obtained")
        exit(1)

    f.write(f'\n\n\nMAE: {mean_absolute_error(relevances, responses)}\n')
    f.write(f'Kappa Coefficient: {cohen_kappa_score(relevances, responses)}\n')
    f.write(f'AUC: {calculate_auc(assesments, QREL_PATH)}\n')