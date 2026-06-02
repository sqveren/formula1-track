from datetime import datetime, timedelta

import httpx

from app.schemas.race import Session

OPENF1_SESSIONS_BY_YEAR_URL = "https://api.openf1.org/v1/sessions"


async def get_sessions_for_race(
    year: int,
    country: str,
    race_date: str,
) -> list[Session]:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            OPENF1_SESSIONS_BY_YEAR_URL,
            params={"year": year},
        )
        response.raise_for_status()

    sessions_data = response.json()
    matching_sessions = [
        session
        for session in sessions_data
        if _is_matching_session(session, country, race_date)
    ]

    return [_map_session(session) for session in sorted(
        matching_sessions,
        key=lambda session: session.get("date_start", ""),
    )]


def _map_session(session_data: dict) -> Session:
    date_start = session_data.get("date_start", "")
    parsed_date = _parse_date_start(date_start)

    return Session(
        name=_normalize_session_name(session_data.get("session_name", "")),
        date=parsed_date.date().isoformat() if parsed_date else "",
        startTime=parsed_date.strftime("%H:%M") if parsed_date else "",
    )


def _parse_date_start(date_start: str) -> datetime | None:
    if not date_start:
        return None

    return datetime.fromisoformat(date_start.replace("Z", "+00:00"))


def _is_matching_session(session_data: dict, country: str, race_date: str) -> bool:
    if session_data.get("is_cancelled"):
        return False

    session_country = session_data.get("country_name", "")
    date_start = session_data.get("date_start", "")
    parsed_date = _parse_date_start(date_start)

    if not parsed_date:
        return False

    race_day = datetime.fromisoformat(race_date).date()
    session_day = parsed_date.date()

    return (
        _normalize_country(session_country) == _normalize_country(country)
        and race_day - timedelta(days=4) <= session_day <= race_day
    )


def _normalize_country(country: str) -> str:
    normalized = country.casefold()

    if normalized == "united states":
        return "usa"

    if normalized == "united kingdom":
        return "uk"

    if normalized == "united arab emirates":
        return "uae"

    return normalized


def _normalize_session_name(session_name: str) -> str:
    session_names = {
        "Practice 1": "FP1",
        "Practice 2": "FP2",
        "Practice 3": "FP3",
    }

    return session_names.get(session_name, session_name)
