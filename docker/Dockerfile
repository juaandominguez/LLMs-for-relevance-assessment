FROM nvidia/cuda:12.2.0-runtime-ubuntu22.04 as base

WORKDIR /app

ENV OLLAMA_MODELS="/mnt/runs/students/juan.dominguezr/cuda/ollama"

RUN apt-get update && apt-get install -y git curl gcc g++ \
    && rm -rf /var/lib/apt/lists/*

# Install Miniconda
RUN curl -sLo /tmp/miniconda.sh https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh \
    && /bin/bash /tmp/miniconda.sh -b -p /opt/conda \
    && rm /tmp/miniconda.sh

ENV PATH=/opt/conda/bin:$PATH

# Create a Python environment, clean up conda cache
RUN conda create -n env python=3.12 -y \
    && conda clean -a -y

# Activate the environment in the shell
RUN echo "source activate env" >> ~/.bashrc

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Copy requirements and install Python packages
COPY ./requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy and run the model pull script
COPY ./pull_llama.sh ./
RUN chmod +x pull_llama.sh && ./pull_llama.sh

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
