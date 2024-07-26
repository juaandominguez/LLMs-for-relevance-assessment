import re
import pandas as pd

PROMPT_TEMPLATE_PATH = 'data/raw/prompt_template.txt'

def extract_topic_info(topic_text):
    num_match = re.search(r'<num>\s*Number:\s*(\d+)', topic_text)
    title_match = re.search(r'<title>\s*(.*?)\s*(?=<desc>)', topic_text, re.DOTALL)
    desc_match = re.search(r'<desc>\s*(Description:)?\s*(.*?)\s*(?=<narr>)', topic_text, re.DOTALL)
    narr_match = re.search(r'<narr>\s*(Narrative:)?\s*(.*?)\s*</top>', topic_text, re.DOTALL)

    num = num_match.group(1).strip() if num_match else None
    title = title_match.group(1).strip() if title_match else None
    desc = desc_match.group(2).strip() if desc_match else None
    narr = narr_match.group(2).strip() if narr_match else None

    return num, title, desc, narr

def parse_topics(text):
    topics = re.split(r'(?=<top>)', text)

    topics = [topic for topic in topics if topic.strip()]

    topics_dict = {}
    for topic in topics:
        num, title, desc, narr = extract_topic_info(topic)
        if num:
            topics_dict[num] = {
                'query': title,
                'description': desc,
                'narrative': narr
            }

    return topics_dict


def process_prompt(query, description, narrative, document_text):
    with open(PROMPT_TEMPLATE_PATH, 'r', encoding='utf-8') as file:
        prompt = file.read()
        prompt = prompt.replace('<query>', query)\
        .replace('<description>', description)\
        .replace('<narrative>', narrative)\
        .replace('<document_text>', document_text)
        return prompt

def extract_document_text(doc_path, doc_id):
    with open(doc_path, 'r', encoding='latin') as file:
        data = file.read()
        full_doc_matches = re.search(r'<DOC>\s*<DOCNO>\s*{}\s*</DOCNO>\s*(.*?)\s*</DOC>'.format(doc_id), data, re.DOTALL)
        full_doc = full_doc_matches.group(1).strip() if full_doc_matches else None
        if full_doc:
            doc_text = re.findall(r'<TEXT>\s*(.*?)\s*</TEXT>',full_doc, re.DOTALL)
            return ' '.join(doc_text)
        return None
