from math import sqrt

from app.schemas.race import DriverAnalytics
from app.services import jolpica_service

PAGE_LIMIT = 100
DNF_STATUSES = {
    "Accident",
    "Collision",
    "Did not finish",
    "Did not start",
    "Disqualified",
    "Retired",
    "Withdrew",
}


async def get_driver_analytics(driver_id: str) -> DriverAnalytics:
    analytics = await get_all_driver_analytics()

    for driver_analytics in analytics:
        if driver_analytics.driverId == driver_id:
            return driver_analytics

    return DriverAnalytics(
        driverId=driver_id,
        driver="Not available yet",
        team="Not available yet",
        average_grid_position=0,
        average_finish_position=0,
        qualifying_race_delta=0,
        consistency=0,
        dnfs=0,
        points_per_race=0,
        podiums=0,
        form=[],
    )


async def get_all_driver_analytics() -> list[DriverAnalytics]:
    result_races = await _fetch_season_races("/current/results", "Results")
    qualifying_races = await _fetch_season_races(
        "/current/qualifying",
        "QualifyingResults",
    )

    grouped: dict[str, dict] = {}

    for race in _sort_races(result_races):
        for race_result in race.get("Results", []):
            driver_data = _get_driver_data(grouped, race_result)
            race_position = _to_int(race_result.get("position"))
            grid_position = _to_int(race_result.get("grid"))
            points = _to_float(race_result.get("points"))
            status = race_result.get("status", "")

            if grid_position > 0:
                driver_data["grid_positions"].append(grid_position)

            if race_position > 0:
                driver_data["finish_positions"].append(race_position)
                driver_data["form"].append(_map_form_result(race_position, status))

                if race_position <= 3:
                    driver_data["podiums"] += 1
            else:
                driver_data["form"].append("DNF")

            if _is_dnf(race_position, status):
                driver_data["dnfs"] += 1

            driver_data["points"].append(points)
            driver_data["race_count"] += 1

    for race in _sort_races(qualifying_races):
        for qualifying_result in race.get("QualifyingResults", []):
            driver_data = _get_driver_data(grouped, qualifying_result)
            qualifying_position = _to_int(qualifying_result.get("position"))

            if qualifying_position > 0:
                driver_data["qualifying_positions"].append(qualifying_position)

    return [
        _map_driver_analytics(driver_id, driver_data)
        for driver_id, driver_data in grouped.items()
    ]


async def _fetch_season_races(path: str, result_key: str) -> list[dict]:
    races_by_round: dict[str, dict] = {}
    offset = 0
    total = 0

    while offset <= total:
        data = await jolpica_service._fetch_jolpica_data(
            f"{path}?limit={PAGE_LIMIT}&offset={offset}"
        )
        metadata = data.get("MRData", {})
        total = _to_int(metadata.get("total"))
        limit = _to_int(metadata.get("limit")) or PAGE_LIMIT
        races = jolpica_service._extract_races(data)

        for race in races:
            round_number = race.get("round", "")
            existing_race = races_by_round.setdefault(
                round_number,
                {**race, result_key: []},
            )
            existing_race[result_key].extend(race.get(result_key, []))

        offset += limit

        if offset >= total:
            break

    return list(races_by_round.values())


def _get_driver_data(grouped: dict[str, dict], result: dict) -> dict:
    driver = result.get("Driver", {})
    constructor = result.get("Constructor", {})
    driver_id = driver.get("driverId") or _map_driver_name(result)

    if driver_id not in grouped:
        grouped[driver_id] = {
            "driver": _map_driver_name(result),
            "team": constructor.get("name", ""),
            "grid_positions": [],
            "finish_positions": [],
            "qualifying_positions": [],
            "points": [],
            "dnfs": 0,
            "podiums": 0,
            "form": [],
            "race_count": 0,
        }

    if constructor.get("name"):
        grouped[driver_id]["team"] = constructor.get("name", "")

    return grouped[driver_id]


def _map_driver_analytics(driver_id: str, driver_data: dict) -> DriverAnalytics:
    average_grid = _average(driver_data["grid_positions"])
    average_finish = _average(driver_data["finish_positions"])
    average_qualifying = _average(driver_data["qualifying_positions"])

    return DriverAnalytics(
        driverId=driver_id,
        driver=driver_data["driver"],
        team=driver_data["team"],
        average_grid_position=_round_metric(average_grid),
        average_finish_position=_round_metric(average_finish),
        qualifying_race_delta=_round_metric(average_qualifying - average_finish),
        consistency=_round_metric(_standard_deviation(driver_data["finish_positions"])),
        dnfs=driver_data["dnfs"],
        points_per_race=_round_metric(
            sum(driver_data["points"]) / driver_data["race_count"]
        )
        if driver_data["race_count"]
        else 0,
        podiums=driver_data["podiums"],
        form=driver_data["form"][-5:],
    )


def _sort_races(races: list[dict]) -> list[dict]:
    return sorted(races, key=lambda race: _to_int(race.get("round")))


def _map_driver_name(result: dict) -> str:
    driver = result.get("Driver", {})
    given_name = driver.get("givenName", "")
    family_name = driver.get("familyName", "")

    return f"{given_name} {family_name}".strip()


def _map_form_result(position: int, status: str) -> str:
    if _is_dnf(position, status):
        return "DNF"

    return f"P{position}"


def _is_dnf(position: int, status: str) -> bool:
    if position <= 0:
        return True

    return status in DNF_STATUSES


def _to_int(value: str | int | None) -> int:
    if value is None or value == "":
        return 0

    return int(value)


def _to_float(value: str | int | float | None) -> float:
    if value is None or value == "":
        return 0

    return float(value)


def _average(values: list[int | float]) -> float:
    if not values:
        return 0

    return sum(values) / len(values)


def _standard_deviation(values: list[int | float]) -> float:
    if len(values) <= 1:
        return 0

    average = _average(values)
    variance = sum((value - average) ** 2 for value in values) / len(values)

    return sqrt(variance)


def _round_metric(value: float) -> float:
    return round(value, 2)
