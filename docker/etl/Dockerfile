FROM openjdk:8-jdk-slim

WORKDIR /app/etl

COPY requirements.txt .

RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip python3-venv gcc git curl procps \
    && python3 -m venv /app/venv \
    && /app/venv/bin/pip install --no-cache-dir -r requirements.txt \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app/etl