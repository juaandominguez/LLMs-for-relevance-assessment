"""
Positive assesor, always return the correct result.
"""
from .base import BaseAssessor

class PositiveOracleAssessor(BaseAssessor):

    def assess(self, _prompt, relevance):
        return relevance