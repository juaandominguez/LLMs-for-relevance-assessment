#!/bin/bash
set -e

# Start the ollama service in the background
ollama serve &>/dev/null &

# Execute any additional commands passed to the container
exec "$@"