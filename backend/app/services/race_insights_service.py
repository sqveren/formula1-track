from app.schemas.race import RaceInsight, RaceInsights
from app.services import jolpica_service


async def get_latest_race_insights() -> RaceInsights:
    data = await jolpica_service._fetch_jolpica_data("/current/last/results")
    races = jolpica_service._extract_races(data)

    if not races:
        return RaceInsights(
            raceName="Not available yet",
            biggestGainer=_empty_insight(),
            biggestLoser=_empty_insight(),
        )

    race = races[0]
    insights = [_map_insight(result) for result in race.get("Results", [])]
    valid_insights = [
        insight
        for insight in insights
        if insight.startingPosition > 0 and insight.finishingPosition > 0
    ]

    if not valid_insights:
        return RaceInsights(
            raceName=race.get("raceName", "Not available yet"),
            biggestGainer=_empty_insight(),
            biggestLoser=_empty_insight(),
        )

    return RaceInsights(
        raceName=race.get("raceName", "Not available yet"),
        biggestGainer=max(
            valid_insights,
            key=lambda insight: insight.positionsGained,
        ),
        biggestLoser=min(
            valid_insights,
            key=lambda insight: insight.positionsGained,
        ),
    )


def _map_insight(result: dict) -> RaceInsight:
    finishing_position = _to_int(result.get("position"))
    starting_position = _to_int(result.get("grid"))

    return RaceInsight(
        driver=_map_driver_name(result),
        startingPosition=starting_position,
        finishingPosition=finishing_position,
        positionsGained=starting_position - finishing_position,
    )


def _empty_insight() -> RaceInsight:
    return RaceInsight(
        driver="Not available yet",
        startingPosition=0,
        finishingPosition=0,
        positionsGained=0,
    )


def _map_driver_name(result: dict) -> str:
    driver = result.get("Driver", {})
    given_name = driver.get("givenName", "")
    family_name = driver.get("familyName", "")

    return f"{given_name} {family_name}".strip()


def _to_int(value: str | int | None) -> int:
    if value is None or value == "":
        return 0

    return int(value)
