"""
Factory module for creating different types of assessors.
"""

from enum import Enum
from . import BaseAssessor, LLamaAssesor, RandomAssessor, NegativeOracleAssessor, PositiveOracleAssessor

class AssessorType(Enum):
    """Enum representing available assessor types."""
    POSITIVE = 'positive'
    NEGATIVE = 'negative'
    RANDOM = 'random'
    LLAMA = 'llama'

    @classmethod
    def list_types(cls):
        """Returns a list of all available assessor types."""
        return [member.value for member in cls]

class AssessorFactory:
    """Factory class for creating different types of assessors."""

    _assessor_mapping = {
        AssessorType.POSITIVE: PositiveOracleAssessor,
        AssessorType.NEGATIVE: NegativeOracleAssessor,
        AssessorType.RANDOM: RandomAssessor,
        AssessorType.LLAMA: LLamaAssesor
    }

    @classmethod
    def create_assessor(cls, assessor_type) -> BaseAssessor:
        """
        Create an assessor instance based on the specified type.

        Args:
            assessor_type (Union[str, AssessorType]): Type of assessor to create.

        Returns:
            Assessor: An instance of the specified assessor.

        Raises:
            ValueError: If the assessor type is not implemented.
        """

        if isinstance(assessor_type, str):
            try:
                assessor_type = AssessorType(assessor_type.lower())
            except ValueError:
                available_types = AssessorType.list_types()
                raise ValueError(f"Invalid assessor type. Available types are: {available_types}")

        assessor_class = cls._assessor_mapping.get(assessor_type)
        if not assessor_class:
            available_types = AssessorType.list_types()
            raise ValueError(f"Assessor is not implemented. Available types are: {available_types}")

        return assessor_class()