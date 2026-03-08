from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID

from app.common.dependencies import get_current_user, RoleChecker
from app.modules.users.models import User, UserRole
from app.modules.clinician.schemas import ClinicianRead, ClinicianCreate, ClinicianUpdate
from app.modules.clinician.dependencies import get_clinician_service
from app.modules.clinician.service import ClinicianService

router = APIRouter(prefix="/clinicians", tags=["Clinicians"])

# Access Control Groups
allow_admin_management = RoleChecker([UserRole.SUPER_ADMIN, UserRole.CLINICIAN_ADMIN])
allow_clinician_access = RoleChecker([UserRole.SUPER_ADMIN, UserRole.CLINICIAN_ADMIN, UserRole.CLINICIAN])

@router.get("/", response_model=List[ClinicianRead], dependencies=[Depends(allow_admin_management)])
async def list_clinicians(service: ClinicianService = Depends(get_clinician_service)):
    """List all clinicians (Admins only)."""
    return await service.list_all()

@router.post("/", response_model=ClinicianRead, dependencies=[Depends(allow_admin_management)])
async def create_clinician_profile(
    obj_in: ClinicianCreate,
    service: ClinicianService = Depends(get_clinician_service)
):
    """Create a clinician profile for an existing user (Admins only)."""
    existing = await service.get_by_user_id(obj_in.user_id)
    if existing:
        raise HTTPException(status_code=400, detail="Clinician profile already exists for this user")
    return await service.create(obj_in)

@router.get("/me", response_model=ClinicianRead)
async def get_my_clinician_profile(
    current_user: User = Depends(get_current_user),
    service: ClinicianService = Depends(get_clinician_service)
):
    """Allow a clinician to view their own profile."""
    profile = await service.get_by_user_id(current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Clinician profile not found")
    return profile

@router.patch("/me", response_model=ClinicianRead)
async def update_my_clinician_profile(
    obj_in: ClinicianUpdate,
    current_user: User = Depends(get_current_user),
    service: ClinicianService = Depends(get_clinician_service)
):
    """Allow a clinician to update their own profile."""
    profile = await service.get_by_user_id(current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Clinician profile not found")
    return await service.update(profile, obj_in)

@router.get("/{clinician_id}", response_model=ClinicianRead, dependencies=[Depends(allow_admin_management)])
async def get_clinician_by_id(
    clinician_id: UUID,
    service: ClinicianService = Depends(get_clinician_service)
):
    """Get any clinician profile by ID (Admins only)."""
    profile = await service.get_by_id(clinician_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Clinician not found")
    return profile