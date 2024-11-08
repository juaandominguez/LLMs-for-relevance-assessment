import re
import pandas as pd
from itertools import combinations


def parse_response(response):
    try:
        match = re.findall(r'\{[^{}]*"O":\s*(\d+)[^{}]*\}', response)
        if match:
            return int(match[-1])
    except:
        print("Error parsing response")
        return None

def calculate_auc(assesments, qrel_path):
    df = pd.read_csv(qrel_path, sep=' ', header=None, names=['query_id', 'doc_id', 'relevance'])

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
                    if assesments[query_id][doc_id_list[i]]['relevance'] == assesments[query_id][doc_id_list[j]]['relevance']:
                        continue
                    golden_relevance = 1 if assesments[query_id][doc_id_list[i]]['relevance'] > assesments[query_id][doc_id_list[j]]['relevance'] else 0
                    response = 1 if assesments[query_id][doc_id_list[i]]['response'] > assesments[query_id][doc_id_list[j]]['response'] else 0
                    all_pairs.append((query_id, doc_id_list[i], doc_id_list[j], golden_relevance, response))
        except KeyError as e:
            pass

    auc_df = pd.DataFrame(all_pairs, columns=['query', 'doc1', 'doc2', 'relevance', 'response'])
    auc_df['coincide'] = auc_df['relevance'] == auc_df['response']
    return auc_df['coincide'].mean()