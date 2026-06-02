from pydantic import BaseModel, ConfigDict


class Session(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    date: str
    startTime: str


class RaceWeekend(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    grandPrixName: str
    circuitName: str
    country: str
    sessions: list[Session]


class QualifyingResult(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    position: int
    driver: str
    team: str
    q1: str
    q2: str
    q3: str


class GridPosition(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    position: int
    driver: str
    team: str


class RaceResult(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    position: int
    driver: str
    team: str
    points: float


class DriverStanding(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    position: int
    driver: str
    team: str
    points: float
    wins: int


class ConstructorStanding(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    position: int
    team: str
    points: float
    wins: int
