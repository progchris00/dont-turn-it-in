from fastapi import APIRouter

from app.api.routes import (
    activities,
    items,
    login,
    private,
    sections,
    submissions,
    users,
    utils,
    admin_analytics,
)
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(items.router)
api_router.include_router(sections.router)
api_router.include_router(activities.router)
api_router.include_router(submissions.router)
api_router.include_router(admin_analytics.router)

if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)

