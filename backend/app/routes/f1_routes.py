from fastapi import APIRouter

from app.services import jolpica_service, openf1_service

router = APIRouter()


@router.get("/weekend")
async def get_weekend() -> dict:
    weekend = await openf1_service.get_latest_weekend()
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
