import pandas as pd

FILE_NAME = 'data/raw/robust04/qrels.robust04.300-450.600-700.trec.txt'
NUM_OF_SAMPLES = 1000
OUTPUT_FILE = 'data/processed/stratified_sampling_pairs.csv'

df = pd.read_csv(FILE_NAME, sep=' ', header=None, usecols=[0, 2, 3])
df.columns = ['TOPIC', 'DOCUMENT', 'RELEVANCE']

df = df.groupby('RELEVANCE', group_keys=False).apply(lambda x: x.sample(NUM_OF_SAMPLES))

df.to_csv(OUTPUT_FILE ,sep=' ', header=None, index=None)