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


class RaceCalendarItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    round: int
    grandPrixName: str
    circuitName: str
    country: str
    raceDate: str
    sessions: list[Session]


class QualifyingResult(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    position: int
    driverId: str = ""
    teamId: str = ""
    driver: str
    team: str
    q1: str
    q2: str
    q3: str


class GridPosition(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    position: int
    driverId: str = ""
    teamId: str = ""
    driver: str
    team: str


class RaceResult(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    position: int
    driverId: str = ""
    teamId: str = ""
    driver: str
    team: str
    points: float


class DriverStanding(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    position: int
    driverId: str = ""
    teamId: str = ""
    driver: str
    team: str
    points: float
    wins: int


class ConstructorStanding(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    position: int
    teamId: str = ""
    team: str
    points: float
    wins: int


class DriverDetails(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    driverId: str
    driver: str
    team: str
    championshipPosition: int
    points: float
    wins: int
    latestResult: str
    nationality: str
    seasonInformation: str


class DriverAnalytics(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    driverId: str
    driver: str
    team: str
    average_grid_position: float
    average_finish_position: float
    qualifying_race_delta: float
    consistency: float
    dnfs: int
    points_per_race: float
    podiums: int
    form: list[str]


class Circuit(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    round: int
    grandPrixName: str
    circuitName: str
    country: str
    raceDate: str
    trackLength: str
    numberOfLaps: int
    raceDistance: str
    firstGrandPrixYear: int


class RaceInsight(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    driver: str
    startingPosition: int
    finishingPosition: int
    positionsGained: int


class RaceInsights(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    raceName: str
    biggestGainer: RaceInsight
    biggestLoser: RaceInsight


class TeamDetails(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    teamId: str
    team: str
    championshipPosition: int
    points: float
    wins: int
    drivers: list[str]
    latestResults: list[str]
