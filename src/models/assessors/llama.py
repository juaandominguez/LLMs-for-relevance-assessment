"""
LLama specific assessor. Calls LLama using Ollama.
"""

from .base import BaseAssessor
from ollama import Client
from utils.functions import parse_response

HOST = 'http://localhost:11434'
MODEL = 'llama3.1'
OPTIONS = {
            'temperature': 0.0,
            'top_p': 1.0,
            'num_predict': 50,
        }


class LLamaAssesor(BaseAssessor):
    def __init__(self):
        self.client = Client(host=HOST)

    def assess(self, prompt, _relevance):
        response = self.client.generate(model=MODEL, prompt=prompt, options=OPTIONS, format='json')['response']

        return parse_response(response)