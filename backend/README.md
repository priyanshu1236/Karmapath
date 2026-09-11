# Backend API

This directory contains the main Python APIs for managing resource data, user history, and assessments.

## Setup
1. Create a virtual environment: `python -m venv venv`
2. Activate it: `source venv/bin/activate` (or your OS equivalent)
3. Install dependencies: `pip install -r requirements.txt`
4. Setup environment variables: `cp .env.example .env` and fill in the missing keys (e.g. `GEMINI_API_KEY`).

## Running
Start the application using the entrypoint (e.g. FastAPI/Uvicorn, if `main.py` is an ASGI app):
```bash
python app/main.py
```

## Data
Generated histories and JSON artifacts for user progress are stored in `data/history/` and `data/resources/`. These are ignored in version control to prevent storing user data.
