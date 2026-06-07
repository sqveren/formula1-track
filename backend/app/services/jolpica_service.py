from datetime import datetime, timezone

import httpx

from app.schemas.race import (
    ConstructorStanding,
    DriverDetails,
    DriverStanding,
    GridPosition,
    QualifyingResult,
    RaceCalendarItem,
    RaceResult,
    RaceWeekend,
    Session,
    TeamDetails,
)
from app.services import openf1_service

JOLPICA_BASE_URL = "https://api.jolpi.ca/ergast/f1"
SESSION_FIELDS = [
    ("FirstPractice", "FP1"),
    ("SecondPractice", "FP2"),
    ("ThirdPractice", "FP3"),
    ("SprintQualifying", "Sprint Qualifying"),
    ("Sprint", "Sprint"),
    ("Qualifying", "Qualifying"),
    ("Race", "Race"),
]


async def get_upcoming_weekend() -> RaceWeekend:
    data = await _fetch_jolpica_data("/current")
    races = _extract_races(data)
    upcoming_race = _find_upcoming_race(races)

    if not upcoming_race:
        return RaceWeekend(
            grandPrixName="",
            circuitName="",
            country="",
            sessions=[],
        )

    year = _to_int(upcoming_race.get("season"))
    race_date = upcoming_race.get("date", "")
    country = (
        upcoming_race.get("Circuit", {})
        .get("Location", {})
        .get("country", "")
    )

    openf1_sessions = await _get_openf1_sessions(year, country, race_date)

    return RaceWeekend(
        grandPrixName=upcoming_race.get("raceName", ""),
        circuitName=upcoming_race.get("Circuit", {}).get("circuitName", ""),
        country=country,
        sessions=openf1_sessions or _map_calendar_sessions(upcoming_race),
    )


async def get_calendar() -> list[RaceCalendarItem]:
    data = await _fetch_jolpica_data("/current")
    races = _extract_races(data)

    return [_map_calendar_item(race) for race in races]


async def get_qualifying() -> list[QualifyingResult]:
    data = await _fetch_jolpica_data("/current/last/qualifying")
    qualifying_results = _extract_results(data, "QualifyingResults")

    return [_map_qualifying_result(result) for result in qualifying_results]


async def get_grid() -> list[GridPosition]:
    try:
        data = await _fetch_jolpica_data("/current/last/grid")
        grid_positions = _extract_results(data, "GridPositions")
    except httpx.HTTPStatusError as exc:
        if exc.response.status_code != 400:
            raise

        data = await _fetch_jolpica_data("/current/last/results")
        grid_positions = sorted(
            _extract_results(data, "Results"),
            key=lambda result: _to_int(result.get("grid")),
        )

    return [_map_grid_position(position) for position in grid_positions]


async def get_race_results() -> list[RaceResult]:
    data = await _fetch_jolpica_data("/current/last/results")
    race_results = _extract_results(data, "Results")

    return [_map_race_result(result) for result in race_results]


async def get_driver_standings() -> list[DriverStanding]:
    data = await _fetch_jolpica_data("/current/driverStandings")
    standings = _extract_standings(data, "DriverStandings")

    return [_map_driver_standing(standing) for standing in standings]


async def get_constructor_standings() -> list[ConstructorStanding]:
    data = await _fetch_jolpica_data("/current/constructorStandings")
    standings = _extract_standings(data, "ConstructorStandings")

    return [_map_constructor_standing(standing) for standing in standings]


async def get_driver_details(driver_id: str) -> DriverDetails:
    standings_data = await _fetch_jolpica_data("/current/driverStandings")
    latest_results_data = await _fetch_jolpica_data("/current/last/results")
    standings = _extract_standings(standings_data, "DriverStandings")
    latest_results = _extract_results(latest_results_data, "Results")

    standing = _find_driver_standing(standings, driver_id)
    latest_result = _find_latest_driver_result(latest_results, driver_id)

    if not standing:
        return DriverDetails(
            driverId=driver_id,
            driver="Not available yet",
            team="Not available yet",
            championshipPosition=0,
            points=0,
            wins=0,
            latestResult="Not available yet",
            nationality="Not available yet",
            seasonInformation=_map_season_information(standings_data),
        )

    constructors = standing.get("Constructors", [])
    team = constructors[0].get("name", "") if constructors else "Not available yet"

    return DriverDetails(
        driverId=driver_id,
        driver=_map_driver_name(standing),
        team=team,
        championshipPosition=_to_int(standing.get("position")),
        points=_to_float(standing.get("points")),
        wins=_to_int(standing.get("wins")),
        latestResult=_map_latest_result(latest_result),
        nationality=standing.get("Driver", {}).get("nationality", "Not available yet"),
        seasonInformation=_map_season_information(standings_data),
    )


async def get_team_details(constructor_id: str) -> TeamDetails:
    constructor_data = await _fetch_jolpica_data("/current/constructorStandings")
    driver_data = await _fetch_jolpica_data("/current/driverStandings")
    latest_results_data = await _fetch_jolpica_data("/current/last/results")

    standing = _find_constructor_standing(
        _extract_standings(constructor_data, "ConstructorStandings"),
        constructor_id,
    )
    drivers = _find_constructor_drivers(
        _extract_standings(driver_data, "DriverStandings"),
        constructor_id,
    )
    latest_results = _find_latest_constructor_results(
        _extract_results(latest_results_data, "Results"),
        constructor_id,
    )

    if not standing:
        return TeamDetails(
            teamId=constructor_id,
            team="Not available yet",
            championshipPosition=0,
            points=0,
            wins=0,
            drivers=drivers,
            latestResults=latest_results,
        )

    return TeamDetails(
        teamId=constructor_id,
        team=standing.get("Constructor", {}).get("name", "Not available yet"),
        championshipPosition=_to_int(standing.get("position")),
        points=_to_float(standing.get("points")),
        wins=_to_int(standing.get("wins")),
        drivers=drivers,
        latestResults=latest_results,
    )


async def _fetch_jolpica_data(path: str) -> dict:
    async with httpx.AsyncClient(follow_redirects=True) as client:
        response = await client.get(f"{JOLPICA_BASE_URL}{path}")
        response.raise_for_status()

    return response.json()


def _extract_races(data: dict) -> list[dict]:
    return (
        data.get("MRData", {})
        .get("RaceTable", {})
        .get("Races", [])
    )


def _extract_results(data: dict, result_key: str) -> list[dict]:
    races = (
        data.get("MRData", {})
        .get("RaceTable", {})
        .get("Races", [])
    )

    if not races:
        return []

    return races[0].get(result_key, [])


def _extract_standings(data: dict, standing_key: str) -> list[dict]:
    standings_lists = (
        data.get("MRData", {})
        .get("StandingsTable", {})
        .get("StandingsLists", [])
    )

    if not standings_lists:
        return []

    return standings_lists[0].get(standing_key, [])


def _map_qualifying_result(result: dict) -> QualifyingResult:
    return QualifyingResult(
        position=_to_int(result.get("position")),
        driverId=result.get("Driver", {}).get("driverId", ""),
        teamId=result.get("Constructor", {}).get("constructorId", ""),
        driver=_map_driver_name(result),
        team=_map_team_name(result),
        q1=result.get("Q1", ""),
        q2=result.get("Q2", ""),
        q3=result.get("Q3", ""),
    )


def _map_grid_position(position: dict) -> GridPosition:
    return GridPosition(
        position=_to_int(position.get("grid", position.get("position"))),
        driverId=position.get("Driver", {}).get("driverId", ""),
        teamId=position.get("Constructor", {}).get("constructorId", ""),
        driver=_map_driver_name(position),
        team=_map_team_name(position),
    )


def _map_race_result(result: dict) -> RaceResult:
    return RaceResult(
        position=_to_int(result.get("position")),
        driverId=result.get("Driver", {}).get("driverId", ""),
        teamId=result.get("Constructor", {}).get("constructorId", ""),
        driver=_map_driver_name(result),
        team=_map_team_name(result),
        points=_to_int(result.get("points")),
    )


def _map_driver_standing(standing: dict) -> DriverStanding:
    constructors = standing.get("Constructors", [])
    team = constructors[0].get("name", "") if constructors else ""

    return DriverStanding(
        position=_to_int(standing.get("position")),
        driverId=standing.get("Driver", {}).get("driverId", ""),
        teamId=constructors[0].get("constructorId", "") if constructors else "",
        driver=_map_driver_name(standing),
        team=team,
        points=_to_float(standing.get("points")),
        wins=_to_int(standing.get("wins")),
    )


def _map_constructor_standing(standing: dict) -> ConstructorStanding:
    return ConstructorStanding(
        position=_to_int(standing.get("position")),
        teamId=standing.get("Constructor", {}).get("constructorId", ""),
        team=standing.get("Constructor", {}).get("name", ""),
        points=_to_float(standing.get("points")),
        wins=_to_int(standing.get("wins")),
    )


def _map_calendar_item(race: dict) -> RaceCalendarItem:
    circuit = race.get("Circuit", {})
    location = circuit.get("Location", {})

    return RaceCalendarItem(
        round=_to_int(race.get("round")),
        grandPrixName=race.get("raceName", ""),
        circuitName=circuit.get("circuitName", ""),
        country=location.get("country", ""),
        raceDate=race.get("date", "Not available yet"),
        sessions=_map_calendar_sessions(race),
    )


def _map_driver_name(result: dict) -> str:
    driver = result.get("Driver", {})
    given_name = driver.get("givenName", "")
    family_name = driver.get("familyName", "")

    return f"{given_name} {family_name}".strip()


def _map_team_name(result: dict) -> str:
    return result.get("Constructor", {}).get("name", "")


def _map_season_information(data: dict) -> str:
    standings_table = data.get("MRData", {}).get("StandingsTable", {})
    season = standings_table.get("season", "Not available yet")
    round_number = standings_table.get("round")

    if round_number:
        return f"{season} season through round {round_number}"

    return f"{season} season"


def _map_latest_result(result: dict | None) -> str:
    if not result:
        return "Not available yet"

    position = result.get("position", "Not available yet")
    points = result.get("points", "0")
    status = result.get("status", "Not available yet")

    return f"P{position}, {points} pts, {status}"


def _find_driver_standing(standings: list[dict], driver_id: str) -> dict | None:
    for standing in standings:
        if standing.get("Driver", {}).get("driverId") == driver_id:
            return standing

    return None


def _find_constructor_standing(
    standings: list[dict],
    constructor_id: str,
) -> dict | None:
    for standing in standings:
        if standing.get("Constructor", {}).get("constructorId") == constructor_id:
            return standing

    return None


def _find_latest_driver_result(results: list[dict], driver_id: str) -> dict | None:
    for result in results:
        if result.get("Driver", {}).get("driverId") == driver_id:
            return result

    return None


def _find_latest_constructor_results(
    results: list[dict],
    constructor_id: str,
) -> list[str]:
    latest_results = []

    for result in results:
        if result.get("Constructor", {}).get("constructorId") == constructor_id:
            latest_results.append(
                f"{_map_driver_name(result)}: {_map_latest_result(result)}"
            )

    return latest_results or ["Not available yet"]


def _find_constructor_drivers(
    standings: list[dict],
    constructor_id: str,
) -> list[str]:
    drivers = []

    for standing in standings:
        constructors = standing.get("Constructors", [])
        if constructors and constructors[0].get("constructorId") == constructor_id:
            drivers.append(_map_driver_name(standing))

    return drivers or ["Not available yet"]


def _to_int(value: str | int | None) -> int:
    if value is None:
        return 0

    return int(value)


def _to_float(value: str | int | float | None) -> float:
    if value is None:
        return 0

    return float(value)


def _find_upcoming_race(races: list[dict]) -> dict | None:
    now = datetime.now(timezone.utc)

    for race in races:
        race_datetime = _parse_race_datetime(race)

        if race_datetime and race_datetime >= now:
            return race

    return None


def _parse_race_datetime(race: dict) -> datetime | None:
    race_date = race.get("date")
    race_time = race.get("time", "00:00:00Z")

    if not race_date:
        return None

    return datetime.fromisoformat(
        f"{race_date}T{race_time}".replace("Z", "+00:00")
    )


def _map_calendar_sessions(race: dict) -> list[Session]:
    sessions = []

    for field_name, session_name in SESSION_FIELDS:
        session_data = race if field_name == "Race" else race.get(field_name)

        if session_data:
            sessions.append(_map_calendar_session(session_name, session_data))

    if not sessions:
        sessions.append(
            Session(
                name="Not available yet",
                date="Not available yet",
                startTime="Not available yet",
            )
        )

    return sessions


def _map_calendar_session(session_name: str, session_data: dict) -> Session:
    return Session(
        name=session_name,
        date=session_data.get("date", "Not available yet"),
        startTime=_format_time(session_data.get("time")),
    )


def _format_time(value: str | None) -> str:
    if not value:
        return "Not available yet"

    return value.removesuffix("Z")[:5]


async def _get_openf1_sessions(
    year: int,
    country: str,
    race_date: str,
) -> list[Session]:
    try:
        return await openf1_service.get_sessions_for_race(year, country, race_date)
    except httpx.HTTPError:
        return []
