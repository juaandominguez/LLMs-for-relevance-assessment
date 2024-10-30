import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error, cohen_kappa_score
from utils.functions import parse_response, calculate_auc
from utils.assesor import Assesor, AssesorType

PROMPTS_PATH = 'data/processed/pooling_prompts.jsonl'
QREL_PATH = 'data/processed/pooling_pairs.csv'
OUTPUT_FILE = 'data/processed/results-with-prompts-pooling-8b.txt'
ASSESSOR_TYPE = AssesorType.NEGATIVE_ORACLE
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

def customKappa(y_true, y_pred):

    if len(y_true) != len(y_pred):
        raise ValueError("Length of y_true and y_pred must be the same")
    if len(y_true) == 0:
        return 1.0

    total = len(y_true)
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)

    tp = np.sum((y_true == 1) & (y_pred == 1))  # True Positive
    fn = np.sum((y_true == 1) & (y_pred == 0))  # False Negative
    tn = np.sum((y_true == 0) & (y_pred == 0))  # True Negative
    fp = np.sum((y_true == 0) & (y_pred == 1))  # False Positive

    print(f'| {tp} | {fn} |\n| {fp} | {tn} |')

    p0 = np.sum(y_true == y_pred) / total
    p_true = np.bincount(y_true) / total
    p_pred = np.bincount(y_pred) / total

    pe = np.sum(p_true * p_pred)

    return (p0 - pe) / (1 - pe)

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
    f.write(f'Custom Kappa Coefficient: {customKappa(relevances, responses)}\n')
    f.write(f'AUC: {calculate_auc(assesments, QREL_PATH)}\n')