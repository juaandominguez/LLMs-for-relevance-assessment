import json
import random

def balance_jsonl_dataset(input_file, output_file):
    """
    Balance a JSONL dataset by ensuring an equal number of non-relevant 
    and relevant entries, with relevance > 2 mapped to 2.
    
    :param input_file: Path to the input JSONL file
    :param output_file: Path to save the balanced JSONL file
    """
    # Read all entries
    non_relevant = []
    relevant = []
    
    # Read the JSONL file
    with open(input_file, 'r') as f:
        for line in f:
            entry = json.loads(line.strip())
            
            # Map relevance > 2 to 2
            if entry['relevance'] > 2:
                entry['relevance'] = 2
            
            # Categorize entries based on relevance
            if entry['relevance'] == 0:
                non_relevant.append(entry)
            elif entry['relevance'] in [1, 2]:
                relevant.append(entry)
    
    # Determine the number of entries to keep
    min_count = min(len(non_relevant), len(relevant))
    
    # Randomly sample entries to balance the dataset
    balanced_non_relevant = random.sample(non_relevant, min_count)
    balanced_relevant = random.sample(relevant, min_count)
    
    # Combine and shuffle the balanced dataset
    balanced_dataset = balanced_non_relevant + balanced_relevant
    random.shuffle(balanced_dataset)
    
    # Write the balanced dataset to a new JSONL file
    with open(output_file, 'w') as f:
        for entry in balanced_dataset:
            f.write(json.dumps(entry) + '\n')
    
    print(f"Balanced dataset created: {len(balanced_dataset)} entries")
    print(f"Non-relevant entries: {len(balanced_non_relevant)}")
    print(f"Relevant entries: {len(balanced_relevant)}")

input_file = 'input_dataset.jsonl'
output_file = 'balanced_dataset.jsonl'
balance_jsonl_dataset(input_file, output_file)