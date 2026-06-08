from fastapi import APIRouter

from app.services import driver_analytics_service, jolpica_service

router = APIRouter()


@router.get("/weekend")
async def get_weekend() -> dict:
    weekend = await jolpica_service.get_upcoming_weekend()
    return {"data": weekend.model_dump()}


@router.get("/calendar")
async def get_calendar() -> dict:
    calendar = await jolpica_service.get_calendar()
    return {"data": [race.model_dump() for race in calendar]}


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
