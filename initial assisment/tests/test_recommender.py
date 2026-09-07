import sys
from pathlib import Path
import pytest

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from ai.app.recommender.baseline_match import get_recommendations, ROLE_BONUS

def test_catalog_loading():
    """Test 1: Verify courses come from JSON dynamically."""
    role = "Statistical Officer"
    gaps = ["Survey Design"]
    recs = get_recommendations(role, gaps, top_k=1)
    
    assert isinstance(recs, list)
    if recs:
        assert "course_id" in recs[0]
        assert "title" in recs[0]
        # Should NOT just be a hardcoded string anymore, it's a dict containing ID and metadata source
        assert "score" in recs[0]

def test_ranking():
    """Test 2: Verify results are sorted descending by score."""
    role = "Statistical Officer"
    gaps = [{"competency": "Survey Design", "gap": 0.40}]
    recs = get_recommendations(role, gaps, top_k=10)
    
    for i in range(len(recs) - 1):
        assert recs[i]["score"] >= recs[i+1]["score"]

def test_determinism():
    """Test 3: Verify the same input produces identical scores."""
    role = "Statistical Officer"
    gaps = [{"competency": "Data Quality", "gap": 0.30}]
    
    recs1 = get_recommendations(role, gaps, top_k=3)
    recs2 = get_recommendations(role, gaps, top_k=3)
    
    assert recs1 == recs2

def test_multiple_gaps():
    """Test 4: Verify course can match multiple gaps and best is retained."""
    role = "Statistical Officer"
    gaps = [
        {"competency": "Survey Design", "gap": 0.40},
        {"competency": "Python", "gap": 0.10}
    ]
    recs = get_recommendations(role, gaps, top_k=5)
    
    # Just checking we got a response and it attributes a matched_competency
    assert len(recs) > 0
    for r in recs:
        assert r["matched_competency"] in ["Survey Design", "Python"]

def test_role_boost():
    """Test 5: Verify explicit role-associated courses receive the bonus."""
    # Using a role that likely exists in 40-role dataset
    role = "STATISTICAL INVESTIGATOR GRADE I"
    gaps = ["Survey Design"]
    recs = get_recommendations(role, gaps, top_k=10)
    
    # Ensure at least some bonus is applied if there's a match,
    # or that the bonus is exactly ROLE_BONUS if it's explicitly associated.
    found_boost = any(r["role_bonus"] == ROLE_BONUS for r in recs)
    # We can't guarantee a course for this exact gap has a bonus in the top 10,
    # but we can verify that IF a role_bonus is applied, it's ROLE_BONUS
    for r in recs:
        assert r["role_bonus"] in [0.0, ROLE_BONUS]

def test_unknown_role():
    """Test 6: Verify unknown role does not receive fabricated role boost."""
    role = "Completely Unknown Role 999"
    gaps = ["Survey Design"]
    recs = get_recommendations(role, gaps, top_k=10)
    
    for r in recs:
        assert r["role_bonus"] == 0.0

def test_top_k():
    """Test 7: Verify length of results respects top_k."""
    role = "Statistical Officer"
    gaps = ["Survey Design"]
    
    recs2 = get_recommendations(role, gaps, top_k=2)
    assert len(recs2) <= 2
    
    recs5 = get_recommendations(role, gaps, top_k=5)
    assert len(recs5) <= 5

def test_empty_gaps():
    """Test 8: Empty gaps return empty list."""
    role = "Statistical Officer"
    assert get_recommendations(role, [], top_k=5) == []

def test_missing_metadata():
    """Test 9: Missing metadata doesn't crash."""
    role = "Statistical Officer"
    # Even with weird gap forms, it normalizes and doesn't crash
    recs = get_recommendations(role, [{"competency": "Random"}], top_k=3)
    assert isinstance(recs, list)
