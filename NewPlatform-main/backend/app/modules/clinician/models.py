import uuid
import enum
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    String,
    Text,
    Integer,
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

if TYPE_CHECKING:
    from app.modules.users.models import User


class ClinicianStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"


class Clinician(Base):
    __tablename__ = "clinicians"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # Linked Authentication User (1-1)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        unique=True,          # one user = one clinician profile
        nullable=False,
        index=True,
    )
    user: Mapped["User"] = relationship(
        "User"
    )

    # Personal Details
    first_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    last_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    avatar_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
    bio: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Professional Details
    specialization: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    credentials: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    registration_id: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )
    certificates: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    consultation_fee: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )
    years_of_experience: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    # Status & Availability
    status: Mapped[ClinicianStatus] = mapped_column(
        Enum(ClinicianStatus, name="clinician_status_enum"),
        default=ClinicianStatus.ACTIVE,
        nullable=False,
    )
    is_available: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        onupdate=func.now(),
        nullable=True,
    )

    def __repr__(self) -> str:
        return f"<Clinician {self.first_name} {self.last_name}>"
    