import random
from ollama import Client
from enum import Enum
from utils.functions import parse_response

class AssesorType(Enum):
    RANDOM = 0
    LLAMA = 1
    POSITIVE_ORACLE = 2
    NEGATIVE_ORACLE = 3

class Assesor:
    def __init__(self):
        self.client = Client(host='http://localhost:11434')

    @staticmethod
    def assess_random():
        return random.choice([0, 1, 2])

    def assess_llama(self, prompt):
        response = self.client.generate(model='llama3.1', prompt=prompt, options={
            'temperature': 0.0,
            'top_p': 1.0,
            'num_predict': 50,
        }, format='json')['response']

        return parse_response(response)


    @staticmethod
    def assess_positive_oracle(relevance):
        return relevance

    @staticmethod
    def assess_negative_oracle(relevance):
        return 1 if relevance == 0 else 0