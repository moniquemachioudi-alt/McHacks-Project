# McHacks-Project
Type B activities for some productive fun. Hopefully, we impress someone. 

# School Assistant

## What it does
A web application that allows students to select their school (McGill, Concordia, UoFT, UBC, or McMaster) and ask questions about school procedures. The backend processes questions by extracting keywords and returning relevant information from the knowledge base.

## Tech Stack
- Frontend: Angular 17 (TypeScript/HTML/CSS) 
- Backend: FastAPI (Python)

## Features
- School selection page with 5 Canadian universities
- Question/Answer interface for each school
- Backend keyword extraction and information retrieval
- Modern, responsive UI with gradient design

## Setup Instructions

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend will run on `http://localhost:8000`

### Frontend Setup
```bash
cd frontend
npm install
ng serve
```
The frontend will run on `http://localhost:4200`

## API Endpoints

- `POST /api/question` - Submit a question about a school
  - Request body: `{ "school": "McGill", "question": "What are the admission requirements?" }`
  - Response: `{ "answer": "...", "keywords": [...] }`
  
- `GET /api/schools` - Get list of available schools

## Project Structure
```
.
├── frontend/          # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── school-selection/    # School selection page
│   │   │   ├── question-page/       # Question/Answer page
│   │   │   └── app.routes.ts        # Routing configuration
│   │   └── main.ts
│   └── package.json
├── backend/           # FastAPI application
│   ├── main.py       # API server and keyword extraction logic
│   └── requirements.txt
└── README.md