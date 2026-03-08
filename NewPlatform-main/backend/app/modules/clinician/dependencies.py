from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.deps import get_db
from app.modules.clinician.service import ClinicianService

async def get_clinician_service(db: AsyncSession = Depends(get_db)) -> ClinicianService:
    return ClinicianService(db)