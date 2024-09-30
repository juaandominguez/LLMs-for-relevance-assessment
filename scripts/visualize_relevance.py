import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

QREL_PATH = 'qrels.robust04.300-450.600-700.trec.txt'
OUTPUT_FILE = 'figures/doc_relevance_hist.png'

# Convert to DataFrame
doc_df = pd.read_csv(QREL_PATH, sep=' ', header=None, names=['query_id', 'doc_id', 'relevance'])

sns.histplot(doc_df['relevance'], discrete=True, color='purple', bins=3, stat='density', edgecolor='black')

plt.title('Histogram of Document Relevance', fontsize=16)
plt.xlabel('Document Relevance', fontsize=14)
plt.ylabel('Percentage', fontsize=14)

# Save plot
plt.savefig(OUTPUT_FILE)

# Count relevance == 2
irrelevant = doc_df[doc_df['relevance'] == 0].count()
relevant = doc_df[doc_df['relevance'] == 1].count()
highly_relevant = doc_df[doc_df['relevance'] == 2].count()

print(f"Number of irrelevant documents: {irrelevant}")
print(f"Number of relevant documents: {relevant}")
print(f"Number of highly relevant documents: {highly_relevant}")

