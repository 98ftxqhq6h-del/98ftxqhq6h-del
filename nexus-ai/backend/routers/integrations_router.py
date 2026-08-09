from fastapi import APIRouter
from services.integrations_service import IntegrationsService

router = APIRouter(prefix="/api/integrations", tags=["Integrations Hub"])

@router.get("/status")
def check_integrations():
    return IntegrationsService.check_all_integrations()

@router.post("/test/{integration_id}")
def test_integration(integration_id: str):
    return IntegrationsService.test_connector(integration_id)
