from fastapi import APIRouter

from app.services import jolpica_service

router = APIRouter()


@router.get("/weekend")
async def get_weekend() -> dict:
    weekend = await jolpica_service.get_upcoming_weekend()
    return {"data": weekend.model_dump()}


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
