"""Local single-process IP limiter, not a distributed production rate limit.

Bounds both per-IP history and total tracked addresses; fail closed at capacity.
Uses the ASGI peer address, never reads forwarding headers itself. Run Uvicorn
with --no-proxy-headers unless a trusted proxy deployment is explicitly set up.
"""

from collections import OrderedDict, deque
from time import monotonic

from starlette.responses import JSONResponse


class AuthGuardMiddleware:
    def __init__(self, app, allowed_origins, max_ips=4096, clock=monotonic):
        self.app = app
        self.allowed_origins = frozenset(allowed_origins)
        self.max_ips = max_ips
        self.clock = clock
        self.attempts = OrderedDict()

    async def __call__(self, scope, receive, send):
        if (
            scope["type"] != "http"
            or scope["method"] != "POST"
            or not scope["path"].startswith("/api/v1/auth/")
        ):
            return await self.app(scope, receive, send)
        origins = [
            value.decode("latin1")
            for key, value in scope["headers"]
            if key == b"origin"
        ]
        if len(origins) != 1 or origins[0] not in self.allowed_origins:
            return await JSONResponse(
                {"detail": "Untrusted request origin"}, status_code=403
            )(scope, receive, send)
        if scope["path"].rstrip("/") in {"/api/v1/auth/register", "/api/v1/auth/login"}:
            now = self.clock()
            while self.attempts:
                key, history = next(iter(self.attempts.items()))
                if history[-1] > now - 60:
                    break
                del self.attempts[key]
            ip = scope.get("client")[0] if scope.get("client") else "unknown"
            history = self.attempts.get(ip)
            if history is None:
                if len(self.attempts) >= self.max_ips:
                    return await self.rejected(scope, receive, send)
                history = self.attempts[ip] = deque()
            while history and history[0] <= now - 60:
                history.popleft()
            if len(history) >= 10:
                return await self.rejected(scope, receive, send)
            history.append(now)
            self.attempts.move_to_end(ip)
        await self.app(scope, receive, send)

    async def rejected(self, scope, receive, send):
        await JSONResponse(
            {"detail": "Too many attempts. Try again later."},
            status_code=429,
            headers={"Retry-After": "60"},
        )(scope, receive, send)
