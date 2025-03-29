from dataclasses import dataclass
from pathlib import Path
from utils.logging import get_logger

logger = get_logger()

@dataclass
class Config:
    prompts_path: str
    qrel_path: str
    json_output_pattern: str
    
    def __post_init__(self) -> None:
        self._validate_paths()
        self._ensure_output_directory()
        
    def _validate_paths(self) -> None:
        if not Path(self.prompts_path).exists():
            logger.error(f"Prompts file not found: {self.prompts_path}")
            raise FileNotFoundError(f"Prompts file not found: {self.prompts_path}")
        if not Path(self.qrel_path).exists():
            logger.error(f"QREL file not found: {self.qrel_path}")
            raise FileNotFoundError(f"QREL file not found: {self.qrel_path}")
            
    def _ensure_output_directory(self) -> None:
        output_dir = Path(self.json_output_pattern).parent
        output_dir.mkdir(parents=True, exist_ok=True)