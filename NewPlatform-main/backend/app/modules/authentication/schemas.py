import enum
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class OTPPurpose(str, enum.Enum):
    AUTH = "auth"
    RESET_PASSWORD = "reset_password"

class SendOTPRequest(BaseModel):
    phone: str

class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str = Field(..., min_length=6, max_length=6)

class SignupEmailRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None

class LoginEmailRequest(BaseModel):
    email: EmailStr
    password: str