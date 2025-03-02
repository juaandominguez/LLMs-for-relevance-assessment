# Use CUDA 11.8 base image with cuDNN 8
FROM nvidia/cuda:11.8.0-cudnn8-devel-ubuntu22.04

# Set working directory
WORKDIR /app

# Define Ollama models path (custom storage)
ENV OLLAMA_MODELS="/mnt/runs/students/juan.dominguezr/cuda/ollama"

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl gcc g++ cmake libssl-dev libcurl4-openssl-dev \
    build-essential

# Install Miniconda
RUN curl -sLo /tmp/miniconda.sh https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh \
    && bash /tmp/miniconda.sh -b -p /opt/conda \
    && rm /tmp/miniconda.sh

# Set Conda path
ENV PATH="/opt/conda/bin:$PATH"

# Create a Python environment, clean up conda cache
RUN conda create -n env python=3.12 -y \
    && conda clean -a -y

# Ensure environment activation in shell sessions
RUN echo "conda activate env" >> ~/.bashrc

# Set CUDA version explicitly
ENV CUDA_VERSION=11.8

# Install required Python packages
COPY ./requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Install Unsloth
RUN pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"

# Install additional Hugging Face packages for fine-tuning
RUN pip install --no-deps trl peft accelerate bitsandbytes
