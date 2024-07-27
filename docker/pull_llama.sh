#!/bin/bash

ollama start &

while ! nc -z localhost 11434; do
  echo "Waiting for ollama service to start..."
  sleep 1
done

ollama pull llama3.1:70b