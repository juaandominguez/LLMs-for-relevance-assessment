from loguru import logger

LOGS_PATH = 'logs/app.log'

logger.add(LOGS_PATH, rotation="10 MB")

def get_logger():
    return logger
