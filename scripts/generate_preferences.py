import pandas as pd
from itertools import combinations

QREL_PATH = 'data/processed/stratified_sampling_pairs.txt'

df = pd.read_csv(QREL_PATH, sep=' ', header=None, names=['query_id', 'doc_id', 'relevance'])

grouped = df.groupby('query_id').agg(list)

all_pairs = []

for query_id, row in grouped.iterrows():
    doc_id_list = row['doc_id']
    relevance_list = row['relevance']
    if len(doc_id_list) == 1:
        all_pairs.append((query_id, doc_id_list[0], None, relevance_list[0]))
    else:
        pairs = list(combinations(range(len(doc_id_list)), 2))
        for i, j in pairs:
            equal_relevance = 1 if relevance_list[i] == relevance_list[j] else 0
            all_pairs.append((query_id, doc_id_list[i], doc_id_list[j], equal_relevance))


pairs_df = pd.DataFrame(all_pairs, columns=['query', 'doc1', 'doc2', 'third_col_equal'])
