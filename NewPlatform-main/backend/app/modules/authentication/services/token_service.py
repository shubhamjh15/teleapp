from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import jwt, JWTError
from app.core.config import settings

class TokenService:
    def __init__(self):
        self.secret_key: str = settings.SECRET_KEY
        self.algorithm: str = settings.JWT_ALGORITHM
        self.access_token_expire_minutes: int = settings.ACCESS_TOKEN_EXPIRE_MINUTES
        self.refresh_token_expire_days: int = settings.REFRESH_TOKEN_EXPIRE_DAYS

    def create_access_token(self, subject: str, role: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=self.access_token_expire_minutes
        )
        payload = {
            "sub": subject,
            "role": role,
            "exp": expire,
            "type": "access",
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def create_refresh_token(self, subject: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(
            days=self.refresh_token_expire_days
        )
        payload = {
            "sub": subject,
            "exp": expire,
            "type": "refresh",
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def create_token_pair(self, subject: str, role: str) -> Dict[str, Any]:
        return {
            "access_token": self.create_access_token(subject, role),
            "refresh_token": self.create_refresh_token(subject),
            "token_type": "bearer",
            "role": role,
        }

    def verify_token(self, token: str, expected_type: Optional[str] = None) -> Dict[str, Any]:
        try:
            payload = jwt.decode(
                token,
                self.secret_key,
                algorithms=[self.algorithm],
            )
            if expected_type and payload.get("type") != expected_type:
                raise JWTError("Invalid token type")
            return payload
        except JWTError:
            raise ValueError("Invalid or expired token")

    def get_subject(self, token: str) -> str:
        payload = self.verify_token(token)
        return payload.get("sub")