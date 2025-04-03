import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_process_document():
    # Criar um arquivo de teste
    test_file = ("test.txt", b"Test content", "text/plain")
    files = {"file": test_file}
    
    response = client.post("/api/process", files=files)
    assert response.status_code == 200
    assert "message" in response.json()

def test_subscribe():
    response = client.post("/api/subscribe", json={"planId": "price_monthly_29"})
    assert response.status_code == 200
    assert "sessionId" in response.json() 