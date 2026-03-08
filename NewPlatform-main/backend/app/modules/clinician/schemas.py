from pydantic import BaseModel, HttpUrl, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.modules.clinician.models import ClinicianStatus

class ClinicianBase(BaseModel):
    first_name: str
    last_name: str
    specialization: str
    credentials: str
    registration_id: str
    years_of_experience: int = 0
    consultation_fee: Optional[int] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    is_available: bool = True
    status: ClinicianStatus = ClinicianStatus.ACTIVE

class ClinicianCreate(ClinicianBase):
    user_id: UUID  # The auth user ID this profile links to

class ClinicianUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    specialization: Optional[str] = None
    credentials: Optional[str] = None
    consultation_fee: Optional[int] = None
    years_of_experience: Optional[int] = None
    is_available: Optional[bool] = None
    status: Optional[ClinicianStatus] = None

class ClinicianRead(ClinicianBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)