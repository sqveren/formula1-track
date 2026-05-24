from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class RaceWeekend(Base):
    __tablename__ = "race_weekends"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    grand_prix_name: Mapped[str] = mapped_column(String, nullable=False)
    circuit_name: Mapped[str] = mapped_column(String, nullable=False)
    country: Mapped[str] = mapped_column(String, nullable=False)

    sessions: Mapped[list["Session"]] = relationship(
        back_populates="race_weekend",
        cascade="all, delete-orphan",
    )


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    race_weekend_id: Mapped[int] = mapped_column(
        ForeignKey("race_weekends.id"),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    date: Mapped[str] = mapped_column(String, nullable=False)
    start_time: Mapped[str] = mapped_column(String, nullable=False)

    race_weekend: Mapped[RaceWeekend] = relationship(back_populates="sessions")


class RaceResult(Base):
    __tablename__ = "race_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    position: Mapped[int] = mapped_column(Integer, nullable=False)
    driver: Mapped[str] = mapped_column(String, nullable=False)
    team: Mapped[str] = mapped_column(String, nullable=False)
    points: Mapped[float] = mapped_column(Float, nullable=False)
    lap_time: Mapped[str | None] = mapped_column(String, nullable=True)

