import secrets
import hashlib
import logging
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.authentication.models import OTP, OTPPurpose

logger = logging.getLogger(__name__)


@dataclass
class OTPVerificationResult:
    verified: bool
    message: str


class OTPService:
    def __init__(self, db: AsyncSession, expiry_seconds: int, max_attempts: int):
        self.db = db
        self.expiry_seconds = expiry_seconds
        self.max_attempts = max_attempts

    def _generate_otp(self) -> str:
        return f"{secrets.randbelow(1000000):06}"

    def _hash_otp(self, otp: str) -> str:
        return hashlib.sha256(otp.encode()).hexdigest()

    async def send_otp(self, phone: str, purpose: OTPPurpose) -> dict:
        otp = self._generate_otp()
        otp_hash = self._hash_otp(otp)

        expires_at = datetime.now(timezone.utc) + timedelta(seconds=self.expiry_seconds)

        await self.db.execute(
            delete(OTP).where(
                OTP.phone == phone,
                OTP.purpose == purpose,
                OTP.used_at.is_(None)
            )
        )

        new_otp = OTP(
            phone=phone,
            purpose=purpose,
            otp_hash=otp_hash,
            expires_at=expires_at,
        )

        self.db.add(new_otp)
        await self.db.commit()

        logger.debug(f"[DEV OTP] Phone: {phone} | OTP: {otp}")

        # DEV ONLY — remove in production
        return {
            "phone": phone,
            "otp": otp
        }

    async def verify_otp(self, phone: str, otp: str, purpose: OTPPurpose) -> OTPVerificationResult:
        stmt = select(OTP).where(
            OTP.phone == phone,
            OTP.purpose == purpose,
            OTP.used_at.is_(None)
        ).order_by(OTP.created_at.desc())

        result = await self.db.execute(stmt)
        otp_record = result.scalar_one_or_none()

        if not otp_record:
            return OTPVerificationResult(False, "OTP not found")

        if datetime.now(timezone.utc) > otp_record.expires_at:
            return OTPVerificationResult(False, "OTP expired")

        if otp_record.attempt_count >= self.max_attempts:
            return OTPVerificationResult(False, "Too many attempts")

        if otp_record.otp_hash != self._hash_otp(otp):
            otp_record.attempt_count += 1
            await self.db.commit()
            return OTPVerificationResult(False, "Invalid OTP")

        otp_record.used_at = datetime.now(timezone.utc)
        await self.db.commit()

        return OTPVerificationResult(True, "OTP verified successfully")
    
