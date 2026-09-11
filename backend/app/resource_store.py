import os
import json
import uuid
from datetime import datetime

UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads", "resources")
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "resources")

os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

def generate_resource_id() -> str:
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_str = uuid.uuid4().hex[:6].upper()
    return f"RES-{timestamp}-{random_str}"

def save_pdf(file_bytes: bytes, original_filename: str) -> dict:
    resource_id = generate_resource_id()
    ext = os.path.splitext(original_filename)[1] or ".pdf"
    filename = f"{resource_id}{ext}"
    file_path = os.path.join(UPLOADS_DIR, filename)
    
    with open(file_path, "wb") as f:
        f.write(file_bytes)
        
    return {
        "resource_id": resource_id,
        "file_path": file_path,
        "filename": original_filename
    }

def save_resource(resource_id: str, metadata: dict, quiz_data: dict):
    resource_dir = os.path.join(DATA_DIR, resource_id)
    os.makedirs(resource_dir, exist_ok=True)
    
    with open(os.path.join(resource_dir, "metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)
        
    with open(os.path.join(resource_dir, "quiz.json"), "w") as f:
        json.dump(quiz_data, f, indent=2)

def list_resources() -> list:
    resources = []
    if not os.path.exists(DATA_DIR):
        return resources
        
    for resource_id in os.listdir(DATA_DIR):
        resource_dir = os.path.join(DATA_DIR, resource_id)
        if not os.path.isdir(resource_dir):
            continue
            
        metadata_path = os.path.join(resource_dir, "metadata.json")
        if os.path.exists(metadata_path):
            try:
                with open(metadata_path, "r") as f:
                    metadata = json.load(f)
                    resources.append(metadata)
            except Exception:
                pass
                
    # Sort resources by resource_id (newest first, since they are timestamped)
    return sorted(resources, key=lambda x: x.get("resource_id", ""), reverse=True)

def get_resource(resource_id: str) -> tuple[dict, list]:
    resource_dir = os.path.join(DATA_DIR, resource_id)
    if not os.path.isdir(resource_dir):
        return None, None
        
    metadata_path = os.path.join(resource_dir, "metadata.json")
    quiz_path = os.path.join(resource_dir, "quiz.json")
    
    metadata = None
    quiz_data = None
    
    if os.path.exists(metadata_path):
        with open(metadata_path, "r") as f:
            metadata = json.load(f)
            
    if os.path.exists(quiz_path):
        with open(quiz_path, "r") as f:
            quiz_data = json.load(f)
            
    return metadata, quiz_data
