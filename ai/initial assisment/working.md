# Complete End-to-End System Working Document

This document provides a highly detailed, step-by-step breakdown of how the AI Assessment & Recommendation Engine works, starting from the moment the frontend sends data, all the way to the final course recommendations.

---

## 1. System Architecture Overview

The system operates as a stateless backend engine designed to integrate with the main SIH application. It consists of two primary modules:
1. **The Assessment Evaluator** (`app/assessment/evaluator.py`)
2. **The Semantic Recommender** (`app/recommender/baseline_match.py`)

All persistent knowledge (roles, competencies, courses, question banks, assessment blueprints) is currently stored in local JSON files inside the `data/` directory. 

---

## 2. Phase 1: The Initial Assessment 

### 2.1 The Data Intake (Frontend -> Backend)
The journey begins when a user completes their assessment on the frontend. The frontend sends a JSON payload to the evaluator containing:
1. **`answers`**: A dictionary mapping a unique Question ID to the user's selected option (e.g., `{"STAT-AS-001": "A", "STAT-SD-001": "C"}`).
2. **`role`**: A string identifier for the user's role (e.g., `"statistical_officer"`).
3. **`domain`**: An optional string descriptor (e.g., `"Statistical"`).

### 2.2 Data Loading
The `evaluate_assessment()` function dynamically resolves paths using Python's `pathlib` and loads three critical files:
- **`assessment_blueprints.json`**: Defines exactly which questions (by ID) are grouped under which Canonical Competency IDs (e.g., `COMP-SURVEY-DESIGN`) for a specific role.
- **`question_bank_statistical_role.json`**: The actual database of questions, containing the question text, options, correct answers, and canonical competency mappings.
- **`role_requirements.json`**: Defines the benchmark capability score required for each competency (currently hardcoded to `80%` for all Statistical Officer competencies).

### 2.3 Evaluation Process & Formulas
The evaluator processes the data through a strict validation loop:
1. **Validation**: It checks that the user's submitted Question IDs actually exist in the role's blueprint and that the provided answers are valid multiple-choice options.
2. **Grading Loop**: It iterates through the blueprint's expected questions. For every question:
   - It checks if the submitted answer matches the `correct_answer` in the question bank.
   - Missing answers are gracefully marked as `0` marks.
   - It increments `total_marks` and `obtained_marks` for the respective competency bucket.

3. **Capability Calculation Formula**:
   - `Capability = (Obtained Marks / Total Marks) * 100` (Rounded to 2 decimal places)
   - *Note: Since the Statistical Officer baseline has 3 questions per competency, capabilities typically land on 0.0, 33.33, 66.67, or 100.0.*

4. **Skill Gap Calculation Formula**:
   - `Gap = max(0.0, Required Score - Capability)`

5. **Gap Status Categorization**:
   Based on the gap size, the system categorizes the urgency using this logic:
   - Gap == 0: **COMPETENT**
   - Gap <= 10: **DEVELOPING**
   - Gap <= 25: **PRIORITY**
   - Gap > 25: **HIGH PRIORITY**

### 2.4 Evaluator Output
The evaluator returns a structured JSON payload representing the user's **Capability Profile**, a sorted array of their **Development Gaps**, and the **Highest Priority Gap**. 

---

## 3. Phase 2: The Semantic Recommendation Engine

Once the frontend/backend receives the Evaluation Output, it takes the `development_gaps` array and passes it into the Recommendation Engine (`get_recommendations()`).

### 3.1 Technology Used
- **Model**: HuggingFace's `sentence-transformers/all-MiniLM-L6-v2`. 
- **Reasoning**: This is a fast, lightweight, local natural language processing (NLP) model that maps text strings into a 384-dimensional dense vector space. It is specifically optimized to perform semantic similarity searches (understanding the *meaning* of words rather than just keyword matching).
- **Mathematics**: **Cosine Similarity**. It measures the cosine of the angle between two multi-dimensional vectors. A score of `1.0` means the texts are semantically identical, `0.0` means they are completely orthogonal/unrelated.

### 3.2 The Recommendation Process
1. **Data Loading**: The system loads the course catalog (`data/courses/courses.json`) and the role-to-course mappings (`data/courses/role_course_mapping.json`).
2. **Course Vectorization**: For every course in the catalog, it constructs a rich text string: `Course: {title} Provider: {provider}` (or just the title if no provider exists). The NLP model converts these strings into vector embeddings.
3. **Query Generation**: For every development gap identified by the evaluator, the engine constructs a search query string:
   - Example: *"To address gap in Survey Design for Statistical Officer"*
4. **Scoring Logic**:
   The engine computes a final ranking score for every course against the query using three distinct variables:
   
   - **Base Semantic Score (Weight: ~1.0)**: The raw Cosine Similarity score between the query embedding and the course embedding.
   - **Role Bonus (Weight: +0.10)**: If a course is explicitly mapped as highly relevant to the `"statistical_officer"` in `role_course_mapping.json`, it receives a flat `0.10` boost.
   - **Gap Priority Boost (Weight: Variable)**: To ensure that severe gaps are prioritized, the system applies a tiny boost based on the size of the gap.
     - *Formula*: `gap_priority = gap_score * 0.001` (e.g., an 80% gap gives a `+0.08` boost).

   - **Final Ranking Formula**: 
     `Total Score = Semantic Score + Role Bonus + Gap Priority`

5. **Sorting & Output**: 
   The system sorts the courses by the `Total Score` in descending order and returns the **Top 3** highest-scoring courses per development gap.

---

## 4. System Limitations

1. **Coarse Capability Resolution**: Because there are only 3 questions per competency, the capability estimates are extremely blocky (0%, 33%, 66%, 100%). It is difficult to accurately measure a true 80% benchmark requirement when the only possible passing grade is 100%.
2. **Semantic Matching Blind Spots**: `all-MiniLM-L6-v2` is a general-purpose language model. It may struggle to understand highly specific statistical domain jargon or incorrectly associate unrelated courses because their titles sound vaguely similar.
3. **Stateless Nature**: The system currently runs completely stateless using local JSON files. It has no concept of database persistence, meaning it cannot track a user's progress over time or handle concurrent read/write scaling inherently.
4. **Static Blueprints**: The assessment blueprint is completely rigid. Every Statistical Officer will answer the exact same 18 questions in the same order, creating a high risk of answer sharing.

---

## 5. Future Additions & Improvements

1. **Item Response Theory (IRT) & Adaptive Testing**:
   - *What*: Implement an algorithm that adjusts the difficulty of the next question based on whether the user answered the previous question correctly.
   - *Why*: This allows for highly precise capability mapping using fewer questions, bypassing the 33% increment limitation.
2. **RAG (Retrieval-Augmented Generation)**:
   - *What*: Feed the course syllabuses and transcripts into a vector database (like Pinecone or Milvus) and use an LLM (like GPT-4 or Claude) to generate highly personalized explanations for *why* a course was recommended.
3. **Database Migration**:
   - *What*: Migrate `json` datasets to a production PostgreSQL database.
   - *Why*: Allows for admin analytics, historical reassessment tracking, and enterprise-grade concurrency.
4. **Expanded Competency Registry**:
   - *What*: Map all 41 iGOT roles into `assessment_blueprints.json` utilizing the generic `competency_id` framework we established.
5. **Rich Metadata Embeddings**:
   - *What*: Pass course `description`, `learning_outcomes`, and `structure` into the embedding model alongside the title.
   - *Why*: To drastically increase the accuracy of semantic matching by giving the NLP model more context about what the course actually teaches.
