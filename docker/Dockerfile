FROM debian:12.6-slim

WORKDIR /app

COPY ./requirements.txt ./

RUN apt-get update && apt-get install git -y && apt-get install curl -y && apt-get install netcat -y

RUN curl -sLo /tmp/miniconda.sh https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh \
    && /bin/bash /tmp/miniconda.sh -b -p /opt/conda \
    && rm /tmp/miniconda.sh

ENV PATH=/opt/conda/bin:$PATH

RUN conda update conda \
    && conda create -n env python=3.12 -y \
    && conda clean -a -y

RUN echo "source activate env" >> ~/.bashrc

RUN curl -fsSL https://ollama.com/install.sh | sh

COPY ./pull_llama.sh ./
RUN chmod +x pull_llama.sh
RUN ./pull_llama.sh

RUN pip install --no-cache-dir -r requirements.txt

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]