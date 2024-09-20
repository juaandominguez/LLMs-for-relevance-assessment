from ollama import Client
import pandas as pd
import re
from sklearn.metrics import mean_absolute_error, cohen_kappa_score
from itertools import combinations

print("Starting Inference...", flush=True)

PROMPTS_PATH = '/mnt/runs/students/juan.dominguezr/TFG/data/processed/prompts.jsonl'
QREL_PATH = '/mnt/runs/students/juan.dominguezr/TFG/data/processed/stratified_sampling_pairs.csv'
OUTPUT_FILE = '/mnt/runs/students/juan.dominguezr/TFG/data/processed/results-with-prompts-8b.txt'

client = Client(host='http://localhost:11434')

prompt_df = pd.read_json(PROMPTS_PATH, lines=True)

def parse_response(response):
    try:
        match = re.findall(r'\{[^{}]*"O":\s*(\d+)[^{}]*\}', response)
        if match:
            return int(match[-1])
    except:
        print("Error parsing response")
        return None

def calculate_auc(assesments):
    df = pd.read_csv(QREL_PATH, sep=' ', header=None, names=['query_id', 'doc_id', 'relevance'])

    grouped = df.groupby('query_id').agg(list)

    all_pairs = []

    for query_id, row in grouped.iterrows():
        doc_id_list = row['doc_id']
        relevance_list = row['relevance']
        try:
            if len(doc_id_list) == 1:
                all_pairs.append((query_id, doc_id_list[0], None, assesments[query_id][doc_id_list[0]]['relevance'], assesments[query_id][doc_id_list[0]]['response']))
            else:
                pairs = list(combinations(range(len(doc_id_list)), 2))
                for i, j in pairs:
                    equal_response = 1 if assesments[query_id][doc_id_list[i]]['response'] == assesments[query_id][doc_id_list[j]]['response'] else 0
                    equal_relevance = 1 if assesments[query_id][doc_id_list[i]]['relevance'] == assesments[query_id][doc_id_list[j]]['relevance'] else 0
                    all_pairs.append((query_id, doc_id_list[i], doc_id_list[j], equal_relevance, equal_response))
        except KeyError as e:
            pass

    auc_df = pd.DataFrame(all_pairs, columns=['query', 'doc1', 'doc2', 'relevance', 'response'])
    auc_df['coincide'] = auc_df['relevance'] == auc_df['response']
    print(auc_df.head(20))
    return auc_df['coincide'].mean()

cnt = 0
with open(OUTPUT_FILE, 'w') as f:
    try:
        assesments = {}
        for line in prompt_df.to_numpy():
            print(f"Line {cnt}", flush=True)
            prompt, relevance, query_id, doc_id = line
            response = client.generate(model='llama3.1', prompt=prompt, options={
                'temperature': 0.0,
                'top_p': 1.0,
                'num_predict': 50,
            }, format='json')['response']
            cnt += 1
            f.write(f'Prompt {cnt}: {response}\n\n')
            response = parse_response(response)

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
    f.write(f'AUC: {calculate_auc(assesments)}\n')