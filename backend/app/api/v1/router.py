from fastapi import APIRouter
from app.api.v1.endpoints import (
    analyze, 
    history, 
    stats, 
    health, 
    billing, 
    auth, 
    community, 
    file_scan
)

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(billing.router, prefix="/billing", tags=["Subscriptions & Billing"])
api_router.include_router(analyze.router, prefix="/analyze", tags=["Analysis"])
api_router.include_router(file_scan.router, prefix="/scan-file", tags=["Document Analysis"])
api_router.include_router(community.router, prefix="/community", tags=["Community Scam Warnings"])
api_router.include_router(history.router, prefix="/history", tags=["History"])
api_router.include_router(stats.router, prefix="/dashboard/stats", tags=["Dashboard"])
