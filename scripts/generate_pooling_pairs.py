import pandas as pd
import os

POOLING_DEPTH = 100
RUNS_PATH = '/mnt/runs/students/juan.dominguezr/TFG/data/raw/robust04/runs'
QREL_PATH = '/mnt/runs/students/juan.dominguezr/TFG/data/raw/robust04/qrels.robust04.300-450.600-700.trec.txt'
OUTPUT_FILE = '/mnt/runs/students/juan.dominguezr/TFG/data/processed/pooling_pairs.csv'

run_dfs = []

for file in os.listdir(RUNS_PATH):
    df = pd.read_csv(f'{RUNS_PATH}/{file}', sep='\s+', header=None, usecols=[0,2], names=['query_id', 'doc_id'])
    grouped = df.groupby('query_id', group_keys=False).head(POOLING_DEPTH).reset_index(drop=True)
    run_dfs.append(grouped)

df = pd.concat(run_dfs, ignore_index=True).drop_duplicates()

qrel_df = pd.read_csv(QREL_PATH, sep=' ', header=None, usecols=[0,2,3], names=['query_id', 'doc_id', 'relevance'])

merged_df = pd.merge(df, qrel_df, on=['query_id', 'doc_id'])

merged_df.to_csv(OUTPUT_FILE, sep=' ',  index=None, header=None)