#!/bin/bash

ollama start &

while ! curl -s http://localhost:11434 >/dev/null; do
  echo "Waiting for ollama service to start..."
  sleep 1
done

ollama pull llama3.1:70b