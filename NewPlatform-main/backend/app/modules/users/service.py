import uuid
import logging
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.users.models import User, UserStatus, UserRole
from app.modules.users.schemas import UserCreate, UserUpdate
from app.core.security import verify_password, get_password_hash

logger = logging.getLogger(__name__)

class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        stmt = select(User).where(User.id == user_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_phone(self, phone: str) -> Optional[User]:
        stmt = select(User).where(User.phone == phone)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[User]:
        stmt = select(User).where(User.email == email)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_active_user_by_phone(self, phone: str) -> Optional[User]:
        stmt = select(User).where(
            User.phone == phone, 
            User.status == UserStatus.ACTIVE
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create_user(self, user_in: UserCreate) -> User:
        db_user = User(
            phone=user_in.phone,
            email=user_in.email,
            full_name=user_in.full_name,
            role=user_in.role,
            status=user_in.status,
            is_verified=True
        )
        self.db.add(db_user)
        await self.db.commit()
        await self.db.refresh(db_user)
        return db_user

    async def create_user_with_password(self, email: str, password: str, full_name: Optional[str] = None) -> User:
        hashed_password = get_password_hash(password)
        db_user = User(
            email=email,
            hashed_password=hashed_password,
            full_name=full_name,
            role=UserRole.USER,
            status=UserStatus.ACTIVE,
            is_verified=False
        )
        self.db.add(db_user)
        await self.db.commit()
        await self.db.refresh(db_user)
        return db_user

    async def update_user(self, user_id: uuid.UUID, user_in: UserUpdate) -> Optional[User]:
        db_user = await self.get_by_id(user_id)
        if not db_user:
            return None

        update_data = user_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field == "password":
                setattr(db_user, "hashed_password", get_password_hash(value))
            else:
                setattr(db_user, field, value)

        await self.db.commit()
        await self.db.refresh(db_user)
        return db_user

    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        user = await self.get_by_email(email)
        if not user or not user.hashed_password:
            return None
        
        if not verify_password(password, user.hashed_password):
            return None
            
        return user
    
    async def update_user_role(self, user_id: uuid.UUID, new_role: UserRole) -> Optional[User]:
        db_user = await self.get_by_id(user_id)
        if not db_user:
            return None
            
        db_user.role = new_role
        await self.db.commit()
        await self.db.refresh(db_user)
        return db_user

    async def get_all_users(self) -> list[User]:
        stmt = select(User).order_by(User.created_at.desc())
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
    
    