import os
import pytrec_eval
from scipy.stats import kendalltau
import numpy as np
from collections import defaultdict

def load_qrels(qrel_file):
    """Load and parse qrel file."""
    try:
        with open(qrel_file, 'r') as f:
            qrels = pytrec_eval.parse_qrel(f)
            print(f"Successfully loaded qrels file with {len(qrels)} queries")
            return qrels
    except Exception as e:
        print(f"Error loading qrels file: {e}")
        raise

def load_run(run_path):
    """Load and parse a single run file."""
    try:
        with open(run_path, 'r') as f:
            run = pytrec_eval.parse_run(f)
            print(f"Successfully loaded run with {len(run)} queries")
            return run
    except Exception as e:
        print(f"Error loading run file {run_path}: {e}")
        return None

def evaluate_run(run_data, qrels, metrics):
    """Evaluate a single run against qrels for given metrics."""
    try:
        evaluator = pytrec_eval.RelevanceEvaluator(qrels, metrics)
        results = evaluator.evaluate(run_data)
        print(f"Successfully evaluated run for {len(results)} queries")
        return results
    except Exception as e:
        print(f"Error evaluating run: {e}")
        return None

def compute_query_scores(results, metrics):
    """Compute per-query scores for each metric."""
    query_scores = defaultdict(dict)
    for query_id, query_results in results.items():
        for metric in metrics:
            query_scores[query_id][metric] = query_results[metric]
    return query_scores

def calculate_system_correlation(run_directory, qrel_file, metrics={'map', 'ndcg'}):
    """Calculate system correlation using Kendall's Tau."""
    print(f"\nProcessing directory: {run_directory}")

    # Load qrels
    qrels = load_qrels(qrel_file)

    # Dictionary to store per-query scores for each run
    run_query_scores = {}

    # Process each run file
    run_files = [f for f in os.listdir(run_directory)]
    print(f"\nFound {len(run_files)} run files")

    if not run_files:
        print(f"No files found in {run_directory}")
        return {}

    # Process each run file
    for run_file in run_files:
        run_path = os.path.join(run_directory, run_file)
        print(f"\nProcessing run: {run_file}")

        # Load run
        run_data = load_run(run_path)
        if run_data is None:
            print(f"Skipping {run_file} due to loading error")
            continue

        # Evaluate run
        results = evaluate_run(run_data, qrels, metrics)
        if results is None:
            print(f"Skipping {run_file} due to evaluation error")
            continue

        # Store per-query scores
        query_scores = compute_query_scores(results, metrics)
        run_query_scores[run_file] = query_scores

    print(f"\nSuccessfully processed {len(run_query_scores)} runs")

    # Calculate correlations and summary statistics
    final_results = {}
    run_names = list(run_query_scores.keys())

    for metric in metrics:
        print(f"\nCalculating correlations for {metric}")
        correlations = []

        for i in range(len(run_names)):
            for j in range(i + 1, len(run_names)):
                run1, run2 = run_names[i], run_names[j]

                # Get common queries between both runs
                queries = set(run_query_scores[run1].keys()) & set(run_query_scores[run2].keys())

                if not queries:
                    print(f"No common queries between {run1} and {run2}")
                    continue

                # Extract scores for common queries
                scores1 = [run_query_scores[run1][qid][metric] for qid in queries]
                scores2 = [run_query_scores[run2][qid][metric] for qid in queries]

                print(f"Comparing {run1} vs {run2} using {len(queries)} queries")
                # Calculate Kendall's Tau
                tau, p_value = kendalltau(scores1, scores2)

                correlations.append({
                    'run1': run1,
                    'run2': run2,
                    'tau': tau,
                    'p_value': p_value,
                    'num_queries': len(queries)
                })

        print(f"Calculated {len(correlations)} correlations for {metric}")

        # Calculate summary statistics for this metric
        tau_values = [result['tau'] for result in correlations]
        if tau_values:
            summary_stats = {
                'mean_tau': np.mean(tau_values),
                'median_tau': np.median(tau_values),
                'std_tau': np.std(tau_values),
                'min_tau': np.min(tau_values),
                'max_tau': np.max(tau_values),
                'num_significant': sum(1 for result in correlations if result['p_value'] < 0.05),
                'total_comparisons': len(correlations)
            }
        else:
            print(f"Warning: No valid correlations found for {metric}")
            summary_stats = {
                'mean_tau': 0.0,
                'median_tau': 0.0,
                'std_tau': 0.0,
                'min_tau': 0.0,
                'max_tau': 0.0,
                'num_significant': 0,
                'total_comparisons': 0
            }

        final_results[metric] = correlations
        final_results[f"{metric}_summary"] = summary_stats

    return final_results

def print_correlations(correlations, significance_threshold=0.05):
    """Print correlation results in a readable format."""
    metrics = {metric for metric in correlations.keys() if not metric.endswith('_summary')}

    for metric in metrics:
        results = correlations[metric]
        print(f"\nCorrelations for {metric.upper()}:")
        print("-" * 100)
        print(f"{'Run 1':<25} {'Run 2':<25} {'Tau':>8} {'P-value':>10} {'Significant':>12} {'Queries':>8}")
        print("-" * 100)

        for result in results:
            # Determine if correlation is significant
            is_significant = result['p_value'] < significance_threshold
            significance_marker = "YES" if is_significant else "NO"

            # Add interpretation of correlation strength
            tau = result['tau']
            if abs(tau) < 0.3:
                strength = "weak"
            elif abs(tau) < 0.7:
                strength = "moderate"
            else:
                strength = "strong"

            print(
                f"{result['run1'][:25]:<25} "
                f"{result['run2'][:25]:<25} "
                f"{result['tau']:8.4f} "
                f"{result['p_value']:10.4f} "
                f"{significance_marker:>12} "
                f"{result['num_queries']:8d}"
            )

            # Add interpretation if correlation is significant
            if is_significant:
                print(f"    ↳ Significant {strength} {'positive' if tau > 0 else 'negative'} correlation")
            else:
                print(f"    ↳ No statistically significant correlation (p > {significance_threshold})")

        # Print summary statistics
        summary = correlations[f"{metric}_summary"]
        print("\nSummary Statistics:")
        print("-" * 50)
        print(f"Mean TAU: {summary['mean_tau']:.4f}")
        print(f"Median TAU: {summary['median_tau']:.4f}")
        print(f"Standard Deviation: {summary['std_tau']:.4f}")
        print(f"Range: [{summary['min_tau']:.4f}, {summary['max_tau']:.4f}]")
        print(f"Significant Correlations: {summary['num_significant']}/{summary['total_comparisons']}")

        # Add interpretation of mean TAU
        mean_tau = summary['mean_tau']
        if abs(mean_tau) < 0.3:
            strength = "weak"
        elif abs(mean_tau) < 0.7:
            strength = "moderate"
        else:
            strength = "strong"

        print(f"\nOverall System Agreement: {strength} "
              f"({'positive' if mean_tau > 0 else 'negative'}) "
              f"with mean TAU of {mean_tau:.4f}")

def main():
    # Configure paths
    run_directory = '/mnt/runs/students/juan.dominguezr/TFG/data/raw/robust04/runs'
    qrel_file = '/mnt/runs/students/juan.dominguezr/TFG/data/processed/qrels-by-llm-8b.txt'

    print("Starting correlation analysis...")
    print(f"Run directory: {run_directory}")
    print(f"Qrel file: {qrel_file}")

    # Check if paths exist
    if not os.path.exists(run_directory):
        print(f"Error: Run directory does not exist: {run_directory}")
        return
    if not os.path.exists(qrel_file):
        print(f"Error: Qrel file does not exist: {qrel_file}")
        return

    # Calculate correlations
    correlations = calculate_system_correlation(run_directory, qrel_file)

    # Print results with interpretation
    print_correlations(correlations)

if __name__ == "__main__":
    main()