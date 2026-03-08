from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.deps import get_db
from app.modules.users.service import UserService

async def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(db)