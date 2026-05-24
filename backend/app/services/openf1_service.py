from datetime import datetime

import httpx

from app.schemas.race import RaceWeekend, Session

OPENF1_SESSIONS_URL = "https://api.openf1.org/v1/sessions?session_key=latest"


async def get_latest_race_weekend() -> RaceWeekend:
    async with httpx.AsyncClient() as client:
        response = await client.get(OPENF1_SESSIONS_URL)
        response.raise_for_status()

    sessions_data = response.json()
    if not sessions_data:
        return RaceWeekend(
            grandPrixName="",
            circuitName="",
            country="",
            sessions=[],
        )

    first_session = sessions_data[0]
    country = first_session.get("country_name", "")

    return RaceWeekend(
        grandPrixName=_build_grand_prix_name(country),
        circuitName=first_session.get("circuit_short_name", ""),
        country=country,
        sessions=[_map_session(session) for session in sessions_data],
    )


def _map_session(session_data: dict) -> Session:
    date_start = session_data.get("date_start", "")
    parsed_date = _parse_date_start(date_start)

    return Session(
        name=session_data.get("session_name", ""),
        date=parsed_date.date().isoformat() if parsed_date else "",
        startTime=parsed_date.strftime("%H:%M") if parsed_date else "",
    )


def _parse_date_start(date_start: str) -> datetime | None:
    if not date_start:
        return None

    return datetime.fromisoformat(date_start.replace("Z", "+00:00"))


def _build_grand_prix_name(country: str) -> str:
    return f"{country} Grand Prix" if country else ""

