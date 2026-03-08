import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from app.common.dependencies import get_current_user, RoleChecker
from app.modules.users.dependencies import get_user_service
from app.modules.users.service import UserService
from app.modules.users.models import User, UserRole
from app.modules.users.schemas import UserRead, UserUpdate, UserRoleUpdate

router = APIRouter(prefix="/users", tags=["Users & Management"])

# --- RBAC Groups ---
admin_only = RoleChecker([UserRole.SUPER_ADMIN])

# STANDARD USER ROUTES (Self-service)
@router.get("/me", response_model=UserRead)
async def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    """Returns the profile of the currently logged-in user."""
    return current_user

@router.patch("/me", response_model=UserRead)
async def update_my_profile(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Allows the current user to update their own profile (name, email)."""
    return await user_service.update_user(current_user.id, user_in)


# ADMIN ROUTES (Requires SUPER_ADMIN)
@router.get("/", response_model=List[UserRead], dependencies=[Depends(admin_only)])
async def list_users(
    user_service: UserService = Depends(get_user_service)
):
    """Returns a list of all users in the system."""
    return await user_service.get_all_users()

@router.get("/{user_id}", response_model=UserRead, dependencies=[Depends(admin_only)])
async def get_user_by_id(
    user_id: uuid.UUID,
    user_service: UserService = Depends(get_user_service)
):
    """Returns details of a specific user by ID."""
    user = await user_service.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/{user_id}/role", response_model=UserRead, dependencies=[Depends(admin_only)])
async def change_user_role(
    user_id: uuid.UUID,
    role_update: UserRoleUpdate,
    user_service: UserService = Depends(get_user_service)
):
    """Allows an admin to change the role of any user (e.g., promote to Clinician)."""
    user = await user_service.update_user_role(user_id, role_update.role)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
