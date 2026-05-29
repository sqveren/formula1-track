import httpx

from app.schemas.race import GridPosition, QualifyingResult, RaceResult

JOLPICA_BASE_URL = "https://api.jolpi.ca/ergast/f1"


async def get_qualifying() -> list[QualifyingResult]:
    data = await _fetch_jolpica_data("/current/last/qualifying")
    qualifying_results = _extract_results(data, "QualifyingResults")

    return [_map_qualifying_result(result) for result in qualifying_results]


async def get_grid() -> list[GridPosition]:
    data = await _fetch_jolpica_data("/current/last/grid")
    grid_positions = _extract_results(data, "GridPositions")

    return [_map_grid_position(position) for position in grid_positions]


async def get_race_results() -> list[RaceResult]:
    data = await _fetch_jolpica_data("/current/last/results")
    race_results = _extract_results(data, "Results")

    return [_map_race_result(result) for result in race_results]


async def _fetch_jolpica_data(path: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{JOLPICA_BASE_URL}{path}")
        response.raise_for_status()

    return response.json()


def _extract_results(data: dict, result_key: str) -> list[dict]:
    races = (
        data.get("MRData", {})
        .get("RaceTable", {})
        .get("Races", [])
    )

    if not races:
        return []

    return races[0].get(result_key, [])


def _map_qualifying_result(result: dict) -> QualifyingResult:
    return QualifyingResult(
        position=_to_int(result.get("position")),
        driver=_map_driver_name(result),
        team=_map_team_name(result),
        q1=result.get("Q1", ""),
        q2=result.get("Q2", ""),
        q3=result.get("Q3", ""),
    )


def _map_grid_position(position: dict) -> GridPosition:
    return GridPosition(
        position=_to_int(position.get("position")),
        driver=_map_driver_name(position),
        team=_map_team_name(position),
    )


def _map_race_result(result: dict) -> RaceResult:
    return RaceResult(
        position=_to_int(result.get("position")),
        driver=_map_driver_name(result),
        team=_map_team_name(result),
        points=_to_int(result.get("points")),
    )


def _map_driver_name(result: dict) -> str:
    driver = result.get("Driver", {})
    given_name = driver.get("givenName", "")
    family_name = driver.get("familyName", "")

    return f"{given_name} {family_name}".strip()


def _map_team_name(result: dict) -> str:
    return result.get("Constructor", {}).get("name", "")


def _to_int(value: str | int | None) -> int:
    if value is None:
        return 0

    return int(value)


