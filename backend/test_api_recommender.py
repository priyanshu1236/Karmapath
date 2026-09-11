import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_valid_recommendation():
    """Test 1 & 2 & 3 & 4: Valid req returns 200, contains role/recs, sorted, top_k respected"""
    payload = {
        "role": "Statistical Officer",
        "development_gaps": [
            {
                "competency": "Survey Design",
                "capability": 0.35,
                "required": 0.75,
                "gap": 0.40,
                "status": "PRIORITY"
            }
        ],
        "top_k": 3
    }
    response = client.post("/api/recommendations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "role" in data
    assert "recommendations" in data
    
    recs = data["recommendations"]
    assert len(recs) <= 3
    
    # Check sorting
    for i in range(len(recs) - 1):
        assert recs[i]["score"] >= recs[i+1]["score"]

def test_empty_gaps():
    """Test 5: Empty development gaps return an empty recommendation list."""
    payload = {
        "role": "Statistical Officer",
        "development_gaps": [],
        "top_k": 5
    }
    response = client.post("/api/recommendations", json=payload)
    assert response.status_code == 200
    assert response.json()["recommendations"] == []

def test_invalid_top_k():
    """Test 6: Invalid top_k is rejected."""
    payload = {
        "role": "Statistical Officer",
        "development_gaps": ["Survey Design"],
        "top_k": 50 # max is 10
    }
    response = client.post("/api/recommendations", json=payload)
    assert response.status_code == 422

def test_missing_role():
    """Test 7: Invalid/missing role is rejected."""
    payload = {
        "role": "", # empty string
        "development_gaps": ["Survey Design"],
        "top_k": 5
    }
    response = client.post("/api/recommendations", json=payload)
    assert response.status_code == 422

def test_existing_assessment_endpoints():
    """Test 8: Existing assessment endpoints still work."""
    # We'll just test generation
    response = client.get("/api/assessment/generate?role=Statistical Officer&domain=Agricultural Statistics&employee_id=EMP001")
    assert response.status_code == 200
    assert "questions" in response.json()
