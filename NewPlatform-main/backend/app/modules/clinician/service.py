import uuid
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.clinician.models import Clinician
from app.modules.clinician.schemas import ClinicianCreate, ClinicianUpdate

class ClinicianService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, clinician_id: uuid.UUID) -> Optional[Clinician]:
        stmt = select(Clinician).where(Clinician.id == clinician_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_user_id(self, user_id: uuid.UUID) -> Optional[Clinician]:
        stmt = select(Clinician).where(Clinician.user_id == user_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(self) -> List[Clinician]:
        stmt = select(Clinician).order_by(Clinician.last_name.asc())
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def create(self, obj_in: ClinicianCreate) -> Clinician:
        db_obj = Clinician(**obj_in.model_dump())
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def update(self, db_obj: Clinician, obj_in: ClinicianUpdate) -> Clinician:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj