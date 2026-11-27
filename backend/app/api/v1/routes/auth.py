from datetime import UTC, datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool

from app.core.config import get_settings
from app.core.security import (
    DUMMY_PASSWORD_HASH,
    create_session_token,
    hash_password,
    token_digest,
    verify_password,
)
from app.db.session import get_db
from app.models.auth_session import AuthSession
from app.models.user import User
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, UserResponse

COOKIE_NAME = "prepbuddy_session"
SESSION_SECONDS = 7 * 24 * 60 * 60
router = APIRouter(prefix="/auth", tags=["auth"])
Database = Annotated[AsyncSession, Depends(get_db)]


async def issue_session(db: AsyncSession, user: User, request: Request, response: Response):
    # Rotate this browser's existing session without logging out other devices.
    old_token = request.cookies.get(COOKIE_NAME)
    if old_token and len(old_token) <= 128:
        await db.execute(
            delete(AuthSession).where(AuthSession.token_digest == token_digest(old_token))
        )
    token = create_session_token()
    expires_at = datetime.now(UTC) + timedelta(seconds=SESSION_SECONDS)
    db.add(AuthSession(token_digest=token_digest(token), user_id=user.id, expires_at=expires_at))
    await db.commit()
    response.set_cookie(
        COOKIE_NAME,
        token,
        max_age=SESSION_SECONDS,
        expires=expires_at,
        httponly=True,
        secure=get_settings().session_cookie_secure,
        samesite="lax",
        path="/",
    )


@router.post("/register", status_code=201, response_model=AuthResponse)
async def register(payload: RegisterRequest, request: Request, response: Response, db: Database):
    user = User(
        name=payload.name,
        email=str(payload.email),
        password_hash=await run_in_threadpool(hash_password, payload.password.get_secret_value()),
    )
    db.add(user)
    try:
        await db.flush()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=409, detail="Unable to register with these details"
        ) from None
    await issue_session(db, user, request, response)
    return AuthResponse(user=UserResponse.model_validate(user))


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, request: Request, response: Response, db: Database):
    user = await db.scalar(select(User).where(User.email == str(payload.email)))
    valid = await run_in_threadpool(
        verify_password,
        payload.password.get_secret_value(),
        user.password_hash if user else DUMMY_PASSWORD_HASH,
    )
    if not user or not valid:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await issue_session(db, user, request, response)
    return AuthResponse(user=UserResponse.model_validate(user))


@router.get("/me", response_model=AuthResponse)
async def me(request: Request, db: Database):
    token = request.cookies.get(COOKIE_NAME)
    if not token or len(token) > 128:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = await db.scalar(
        select(User)
        .join(AuthSession, AuthSession.user_id == User.id)
        .where(
            AuthSession.token_digest == token_digest(token),
            AuthSession.expires_at > datetime.now(UTC),
        )
    )
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return AuthResponse(user=UserResponse.model_validate(user))


@router.post("/logout")
async def logout(request: Request, response: Response, db: Database):
    token = request.cookies.get(COOKIE_NAME)
    if token and len(token) <= 128:
        await db.execute(delete(AuthSession).where(AuthSession.token_digest == token_digest(token)))
        await db.commit()
    response.delete_cookie(
        COOKIE_NAME,
        path="/",
        httponly=True,
        secure=get_settings().session_cookie_secure,
        samesite="lax",
    )
    return {"message": "Logged out"}
