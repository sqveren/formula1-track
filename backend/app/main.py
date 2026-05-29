from fastapi import FastAPI

from app.routes.f1_routes import router as f1_router

app = FastAPI(title="Formula Track API")

app.include_router(f1_router)
