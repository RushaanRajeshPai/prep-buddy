from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError

from app.api.dependencies import DatabaseProbe, get_database_probe

router = APIRouter()


@router.get("/health", tags=["health"])
async def health(probe: Annotated[DatabaseProbe, Depends(get_database_probe)]) -> dict[str, str]:
    try:
        await probe()
    except SQLAlchemyError:
        raise HTTPException(status_code=503, detail="Database unavailable") from None
    return {"status": "ok", "service": "PrepBuddy", "database": "connected"}
