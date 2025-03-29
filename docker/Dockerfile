FROM nvidia/cuda:11.8.0-cudnn8-devel-ubuntu22.04

WORKDIR /app

ENV OLLAMA_MODELS="/mnt/runs/students/juan.dominguezr/cuda/ollama"

RUN apt-get update && apt-get install -y \
    git curl gcc g++ cmake libssl-dev libcurl4-openssl-dev \
    build-essential

RUN curl -sLo /tmp/miniconda.sh https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh \
    && bash /tmp/miniconda.sh -b -p /opt/conda \
    && rm /tmp/miniconda.sh

ENV PATH="/opt/conda/bin:$PATH"

RUN conda create -n env python=3.12 -y \
    && conda clean -a -y

RUN echo "conda activate env" >> ~/.bashrc

ENV CUDA_VERSION=11.8

COPY ./requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

RUN pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"

RUN pip install --no-deps trl peft accelerate bitsandbytes

RUN curl -fsSL https://ollama.com/install.sh | sh

COPY ./pull_llama.sh ./
RUN chmod +x pull_llama.sh && ./pull_llama.sh

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN export PATH=$PATH:/home/juan.dominguezr/.local/bin

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]