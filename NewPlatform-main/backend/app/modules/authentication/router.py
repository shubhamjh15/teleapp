from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import Any

from app.modules.authentication.schemas import (
    SendOTPRequest,
    VerifyOTPRequest,
    LoginEmailRequest,
    SignupEmailRequest
)
from app.modules.authentication.dependencies import get_otp_service, get_token_service
from app.modules.authentication.services.otp_service import OTPService
from app.modules.authentication.services.token_service import TokenService
from app.modules.authentication.models import OTPPurpose

from app.modules.users.dependencies import get_user_service
from app.modules.users.service import UserService
from app.modules.users.models import UserStatus
from app.modules.users.schemas import UserCreate
from app.core.rate_limit import limiter

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

@router.post("/otp/send", status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
async def send_otp(
    request: Request,
    send_request: SendOTPRequest,
    otp_service: OTPService = Depends(get_otp_service),
):
    response = await otp_service.send_otp(
        phone=send_request.phone,
        purpose=OTPPurpose.AUTH,
    )
    return {
        "message": "OTP sent successfully",
        "dev_otp": response.get("otp"),
    }

@router.post("/otp/verify", status_code=status.HTTP_200_OK)
@limiter.limit("10/minute")
async def verify_otp(
    request: Request,
    verify_request: VerifyOTPRequest,
    otp_service: OTPService = Depends(get_otp_service),
    token_service: TokenService = Depends(get_token_service),
    user_service: UserService = Depends(get_user_service)
):
    # 1. Verify the OTP code
    result = await otp_service.verify_otp(
        phone=verify_request.phone,
        otp=verify_request.otp,
        purpose=OTPPurpose.AUTH,
    )
    if not result.verified:
        raise HTTPException(status_code=400, detail=result.message)

    # 2. Get or Create User
    user = await user_service.get_by_phone(verify_request.phone)
    if not user:
        # Sign up (Automatic)
        user = await user_service.create_user(
            UserCreate(phone=verify_request.phone)
        )
    
    # 3. Check status
    if user.status != UserStatus.ACTIVE:
        raise HTTPException(status_code=403, detail=f"Account is {user.status}")

    return token_service.create_token_pair(subject=str(user.id), role=user.role.value)

@router.post("/reset-password/send-otp", status_code=status.HTTP_200_OK)
async def send_reset_password_otp(
    send_request: SendOTPRequest,
    otp_service: OTPService = Depends(get_otp_service),
):
    response = await otp_service.send_otp(
        phone=send_request.phone,
        purpose=OTPPurpose.RESET_PASSWORD,
    )
    return {
        "message": "Reset password OTP sent successfully",
        "dev_otp": response.get("otp"),
    }

# dummy for now
@router.post("/reset-password/verify-otp", status_code=status.HTTP_200_OK)
async def verify_reset_password_otp(
    send_request: VerifyOTPRequest,
    otp_service: OTPService = Depends(get_otp_service),
):
    result = await otp_service.verify_otp(
        phone=send_request.phone,
        otp=send_request.otp,
        purpose=OTPPurpose.RESET_PASSWORD,
    )

    if not result.verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.message,
        )

    return {"message": result.message}




@router.post("/signup/password", status_code=status.HTTP_201_CREATED)
async def signup_with_password(
    request: Request,
    send_request: SignupEmailRequest,
    user_service: UserService = Depends(get_user_service),
    token_service: TokenService = Depends(get_token_service),
):
    if await user_service.get_by_email(send_request.email):
        raise HTTPException(status_code=400, detail="Email already exists")

    user = await user_service.create_user_with_password(
        email=send_request.email,
        password=send_request.password,
        full_name=send_request.full_name
    )
    return token_service.create_token_pair(subject=str(user.id), role=user.role.value)

@router.post("/login/password", status_code=status.HTTP_200_OK)
async def login_with_password(
    request: Request,
    send_request: LoginEmailRequest,
    user_service: UserService = Depends(get_user_service),
    token_service: TokenService = Depends(get_token_service),
):
    user = await user_service.authenticate_user(send_request.email, send_request.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user.status != UserStatus.ACTIVE:
        raise HTTPException(status_code=403, detail="Account inactive")

    return token_service.create_token_pair(subject=str(user.id), role=user.role.value)

