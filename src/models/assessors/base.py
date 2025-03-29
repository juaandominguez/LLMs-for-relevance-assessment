"""
Abstract base class for assessors.
"""
from abc import ABC, abstractmethod

class BaseAssessor(ABC):

    @abstractmethod
    def assess(self, prompt, relevance):
        raise NotImplementedError("Method is not implemented")