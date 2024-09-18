import pandas as pd

POOLING_DEPTH = 100

df = pd.read_csv('qrels.robust04.300-450.600-700.trec.txt', sep=' ', header=None, usecols=[0,2,3], names=['query_id', 'doc_id', 'relevance'])

grouped = df.groupby('query_id', group_keys=False).apply(
    lambda x: x.sort_values(by='relevance', ascending=False).head(POOLING_DEPTH)
).reset_index(drop=True)

grouped.to_csv('data/processed/pooling_prompts.csv', sep=' ', header=None, index=None)