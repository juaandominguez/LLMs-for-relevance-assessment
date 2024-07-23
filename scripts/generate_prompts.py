from utils.utils import process_prompt, parse_topics, extract_document_text
import pandas as pd
import json

QREL_PATH = 'data/processed/stratified_sampling_pairs.txt'
TOPICS_PATH = 'data/raw/robust04/topics.301-450.601-700.trec.txt'
DOCS_PATH = 'data/processed/doc_paths.csv'
PROMPT_OUTPUT_PATH = 'data/processed/prompts.jsonl'

parsed_topics = {}
list_df = []
docs_df = pd.read_csv(DOCS_PATH, names=['doc_id', 'doc_path'])


with open(TOPICS_PATH, 'r') as file:
    text = file.read()
    parsed_topics = parse_topics(text)

with open(QREL_PATH, 'r') as file:
    while(x := file.readline().split()):
        query_id, doc_id, relevance = x

        if query_id in parsed_topics:
            list_df.append([query_id, parsed_topics[query_id]['query'], parsed_topics[query_id]['description'], parsed_topics[query_id]['narrative'], doc_id, relevance])
            continue
        else:
            print(f"No matching topic found for query id {query_id}")

df = pd.DataFrame(list_df, columns=['query_id', 'query', 'description', 'narrative', 'doc_id', 'relevance'])

with open(PROMPT_OUTPUT_PATH, 'w') as file:
    for line in df.to_numpy():
        query_id, query, description, narrative, doc_id, relevance = line
        doc_path = docs_df.loc[docs_df['doc_id'] == doc_id]['doc_path'].values[0]
        document_text = extract_document_text(doc_path, doc_id)
        file.write(
            json.dumps({
                'prompt': process_prompt(query, description, narrative, document_text),
                'relevance': relevance
            }) + '\n'
        )

