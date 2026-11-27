from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import router
from app.core.auth_guard import AuthGuardMiddleware
from app.core.config import get_settings
from app.db.session import get_engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    if get_engine.cache_info().currsize:
        await get_engine().dispose()
        get_engine.cache_clear()


def create_app() -> FastAPI:
    app = FastAPI(title="PrepBuddy", version="0.1.0", lifespan=lifespan)
    app.add_middleware(AuthGuardMiddleware, allowed_origins=get_settings().cors_origins)

    @app.exception_handler(RequestValidationError)
    async def safe_validation_error(request, exc):
        # Never echo submitted credentials or request bodies in API errors.
        return JSONResponse(
            status_code=422,
            content={
                "detail": [
                    {"type": error["type"], "loc": error["loc"], "msg": error["msg"]}
                    for error in exc.errors()
                ]
            },
        )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_settings().cors_origins,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
        allow_credentials=True,
    )
    app.include_router(router, prefix="/api/v1")
    return app


app = create_app()
