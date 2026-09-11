# AI Services

This directory handles the core evaluation logic, semantic matching, and skill-gap recommendations.

## Setup
1. Create a virtual environment: `python -m venv .venv`
2. Activate it: `source .venv/bin/activate` (or your OS equivalent)
3. Install dependencies: `pip install -r requirements.txt`

## Components
- **Assessment Evaluators:** Connects to LLMs to evaluate responses against rubrics.
- **RAG & Embeddings:** Manages `chroma.db` for semantic similarity matching (e.g. using Sentence Transformers).
- **Data Sets:** Static catalogs, roles, and blueprints are located in `data/`.

*Note: Large generated databases (like `chroma.db`) and caches are intentionally ignored in Git and must be rebuilt locally.*
