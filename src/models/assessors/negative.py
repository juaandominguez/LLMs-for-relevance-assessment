"""
Negative assesor, always return the opposite result.
"""
from .base import BaseAssessor

class NegativeOracleAssessor(BaseAssessor):

    def assess(self, _prompt, relevance):
        return 1 if relevance == 0 else 0