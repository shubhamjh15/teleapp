from contextlib import asynccontextmanager
from fastapi import FastAPI
import logging
from app.core.config import settings
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.logging import setup_logging
from app.core.rate_limit import limiter

from app.modules.authentication.router import router as auth_router
from app.modules.users.router import router as user_router
from app.modules.clinician.router import router as clinician_router

setup_logging()

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Application starting up...")
    yield
    logger.info("Application shutting down...")

def create_application() -> FastAPI:
    application = FastAPI(
        title="Health360",
        description="Routes for Health360 backend",
        version="1.0.2",
        lifespan=lifespan,
        docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
        redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
        openapi_url="/openapi.json" if settings.ENVIRONMENT != "production" else None,
    )

    if settings.ENVIRONMENT != "production":
        application.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    else:
        application.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # --- Rate Limiter ---
    application.state.limiter = limiter
    application.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # --- Include Routers ---
    application.include_router(
        auth_router, 
        prefix="/api/v1"
    )
    application.include_router(
        user_router,
        prefix="/api/v1"
    )
    application.include_router(
        clinician_router,
        prefix="/api/v1"
    )

    return application

app = create_application()

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    # In production, use 'uvicorn app.main:app --host 0.0.0.0 --port 8000'
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False, log_config=None)