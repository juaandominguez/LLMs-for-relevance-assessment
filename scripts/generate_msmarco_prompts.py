import ir_datasets

# Load the dataset
dataset = ir_datasets.load("msmarco-document-v2/trec-dl-2022/judged")

# Create a dictionary to map query IDs to their text
queries = {query.query_id: query.text for query in dataset.queries_iter()}
# Create a dictionary to map document IDs to their content
documents = {doc.doc_id: f'{doc.title} {doc.headings} {doc.body}' for doc in dataset.docs_iter()}

# Iterate through QRELs to generate prompts
for qrel in dataset.qrels_iter():
    query_text = queries.get(qrel.query_id, "Query not found")
    document_text = documents.get(qrel.doc_id, "Document not found")
    relevance = qrel.relevance

    # Generate a prompt combining query, document, and relevance
    prompt = f"Query: {query_text}\nDocument: {document_text}\nRelevance: {relevance}\n"
    
    print(prompt)
