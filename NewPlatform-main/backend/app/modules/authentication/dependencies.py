from fastapi import Depends
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.deps import get_db
from app.core.config import settings
from app.modules.authentication.services.otp_service import OTPService
from app.modules.authentication.services.token_service import TokenService


async def get_otp_service(db: AsyncSession = Depends(get_db)) -> OTPService:
    return OTPService(
        db=db, 
        expiry_seconds=settings.OTP_EXPIRY_DURATION,
        max_attempts=settings.OTP_MAX_ATTEMPT
    )

async def get_token_service() -> TokenService:
    return TokenService()