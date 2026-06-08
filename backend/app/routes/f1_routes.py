from fastapi import APIRouter

from app.services import (
    circuit_service,
    driver_analytics_service,
    jolpica_service,
    race_insights_service,
)

router = APIRouter()


@router.get("/weekend")
async def get_weekend() -> dict:
    weekend = await jolpica_service.get_upcoming_weekend()
    return {"data": weekend.model_dump()}


@router.get("/calendar")
async def get_calendar() -> dict:
    calendar = await jolpica_service.get_calendar()
    return {"data": [race.model_dump() for race in calendar]}


@router.get("/circuits")
async def get_circuits() -> dict:
    circuits = await circuit_service.get_circuits()
    return {"data": [circuit.model_dump() for circuit in circuits]}


@router.get("/circuits/{circuit_name}")
async def get_circuit(circuit_name: str) -> dict:
    circuit = await circuit_service.get_circuit(circuit_name)
    return {"data": circuit.model_dump()}


@router.get("/qualifying")
async def get_qualifying() -> dict:
    qualifying = await jolpica_service.get_qualifying()
    return {"data": [result.model_dump() for result in qualifying]}


@router.get("/grid")
async def get_grid() -> dict:
    grid = await jolpica_service.get_grid()
    return {"data": [position.model_dump() for position in grid]}


@router.get("/results")
async def get_results() -> dict:
    results = await jolpica_service.get_race_results()
    return {"data": [result.model_dump() for result in results]}


@router.get("/race-insights")
async def get_race_insights() -> dict:
    insights = await race_insights_service.get_latest_race_insights()
    return {"data": insights.model_dump()}


@router.get("/driver-standings")
async def get_driver_standings() -> dict:
    standings = await jolpica_service.get_driver_standings()
    return {"data": [standing.model_dump() for standing in standings]}


@router.get("/constructor-standings")
async def get_constructor_standings() -> dict:
    standings = await jolpica_service.get_constructor_standings()
    return {"data": [standing.model_dump() for standing in standings]}


@router.get("/driver/{driver_id}")
async def get_driver_details(driver_id: str) -> dict:
    details = await jolpica_service.get_driver_details(driver_id)
    return {"data": details.model_dump()}


@router.get("/driver/{driver_id}/analytics")
async def get_driver_analytics(driver_id: str) -> dict:
    analytics = await driver_analytics_service.get_driver_analytics(driver_id)
    return {"data": analytics.model_dump()}


@router.get("/team/{constructor_id}")
async def get_team_details(constructor_id: str) -> dict:
    details = await jolpica_service.get_team_details(constructor_id)
    return {"data": details.model_dump()}
