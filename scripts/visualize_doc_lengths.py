from utils.functions import extract_document_text
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

DOCS_PATH = '/mnt/runs/students/juan.dominguezr/TFG/data/processed/doc_paths.csv'
OUTPUT_FILE = '/mnt/runs/students/juan.dominguezr/TFG/figures/doc_lengths_hist_fixed.png'

docs_df = pd.read_csv(DOCS_PATH, names=['doc_id', 'doc_path'])

doc_lengths = []

# Extract document lengths
for line in docs_df.to_numpy():
    doc_id, doc_path = line
    document_text = extract_document_text('/mnt/runs/students/juan.dominguezr/TFG/' + doc_path, doc_id)
    doc_lengths.append(len(document_text))

# Convert to DataFrame
doc_df = pd.DataFrame(doc_lengths, columns=['length'])

# Apply log transformation ONLY for plotting purposes (no data loss)
doc_df['log_length'] = np.log1p(doc_df['length'])  # log1p to handle zero lengths, if any

# Plot histogram with KDE for log-transformed data
plt.figure(figsize=(10, 6))

sns.histplot(doc_df['log_length'], kde=True, color='purple', bins=20, stat='density', edgecolor='black')

plt.legend(labels=['KDE', 'Document'], fontsize=12, loc='upper right')

plt.title('Log-Transformed Histogram and KDE of Document Lengths', fontsize=16)
plt.xlabel('Log Document Length', fontsize=14)
plt.ylabel('Density', fontsize=14)

# Save plot
plt.savefig(OUTPUT_FILE)

# Optionally, show the original non-log plot
plt.figure(figsize=(10, 6))

sns.histplot(doc_df['length'], kde=True, color='blue', bins=20, stat='density', edgecolor='black')

plt.legend(labels=['KDE', 'Document'], fontsize=12, loc='upper right')

plt.title('Original Histogram and KDE of Document Lengths', fontsize=16)
plt.xlabel('Document Length', fontsize=14)
plt.ylabel('Density', fontsize=14)

# Save original plot
plt.savefig(OUTPUT_FILE.replace('fixed', 'original'))
