import logging
from .config import settings

def setup_logging():
    environment = settings.ENVIRONMENT

    if environment == "development":
        log_level = logging.DEBUG
    else:
        log_level = logging.INFO

    logging.basicConfig(
        level=log_level,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )

    # Optional: reduce noisy libraries in prod
    if environment != "development":
        logging.getLogger("uvicorn.access").setLevel(logging.WARNING)

