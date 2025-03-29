"""
Random assesor, always returns a random result.
"""
import random
from .base import BaseAssessor

class RandomAssessor(BaseAssessor):

    def assess(self, _prompt, _relevance):
        return random.choice([0, 1, 2])