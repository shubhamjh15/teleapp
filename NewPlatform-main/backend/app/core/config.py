from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Literal
from pydantic import SecretStr, EmailStr
import os

class Settings(BaseSettings):
    API_VERSION: str = "/api/v1"
    PROJECT_NAME: str = "Health360"
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"

    # Postgress database
    DATABASE_URL: SecretStr

    # OTP
    OTP_EXPIRY_DURATION: int
    OTP_MAX_ATTEMPT: int

    # Token
    SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # SMTP
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USER: EmailStr
    SMTP_PASS: SecretStr

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(__file__), "../../.env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()