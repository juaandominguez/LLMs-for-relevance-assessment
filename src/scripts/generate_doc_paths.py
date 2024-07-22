import os
import re
import pandas as pd

TREC_DOCS_PATH = 'data/raw/robust04/disks'
OUTPUT_PATH = 'data/processed/doc_paths.csv'

dict_df = {}

def process_file(filename):
    with open(filename, 'r', encoding='latin') as f:
        data = f.read()
        doc_id_matches = re.findall(r'<DOCNO>\s*(.*?)\s*</DOCNO>', data)
        for doc_id in doc_id_matches:
            dict_df[doc_id.strip()] = filename

for dirpath, dirs, files in os.walk(TREC_DOCS_PATH):
  for filename in files:
    fname = os.path.join(dirpath,filename)
    process_file(fname)

df = pd.DataFrame.from_dict(dict_df, orient='index')
df.to_csv(OUTPUT_PATH, header=False)