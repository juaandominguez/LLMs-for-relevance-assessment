import random
from ollama import Client
from enum import Enum
from utils.functions import parse_response
import random

RELEVANT_PROB = 0.94
HIGHLY_RELEVANT_PROB = 0.06

class AssesorType(Enum):
    RANDOM = 0
    LLAMA = 1
    POSITIVE_ORACLE = 2
    NEGATIVE_ORACLE = 3

class Assesor:
    def __init__(self):
        client = Client(host='http://localhost:11434')

    @staticmethod
    def assess_random():
        return random.choice([0, 1, 2])

    def assess_llama(prompt):
        response = client.generate(model='llama3.1', prompt=prompt, options={
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
        if relevance == 0:
            rand = random.random()
            if rand < RELEVANT_PROB:
                return 1
            else:
                return 2
        else:
            return 0