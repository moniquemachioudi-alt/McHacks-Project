from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re
import json
from typing import List, Dict

app = FastAPI(title="School Assistant API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# School knowledge base - in a real application, this would be a database
SCHOOL_KNOWLEDGE_BASE: Dict[str, Dict[str, str]] = {
    "McGill": {
        "admission": "McGill University admission requirements include high school transcripts, standardized test scores, and proof of English proficiency. Application deadline is typically January 15th.",
        "tuition": "McGill tuition fees vary by program and residency status. International students typically pay between $18,000-$50,000 CAD per year.",
        "registration": "Course registration at McGill opens based on your student level. Check Minerva for your specific registration time slot.",
        "grades": "McGill uses a letter grade system (A, B, C, D, F) with GPA calculated on a 4.0 scale. You can view grades on Minerva.",
        "campus": "McGill has two campuses: Downtown campus in Montreal and Macdonald campus in Sainte-Anne-de-Bellevue.",
    },
    "Concordia": {
        "admission": "Concordia University accepts applications year-round. Requirements include academic transcripts, proof of English proficiency, and program-specific prerequisites.",
        "tuition": "Concordia tuition fees are approximately $10,000-$20,000 CAD per year for Quebec residents and $25,000-$35,000 for non-residents.",
        "registration": "Registration at Concordia is done through MyConcordia portal. Registration periods vary by faculty and student level.",
        "grades": "Concordia uses letter grades (A+, A, A-, B+, B, etc.) with a 4.3 GPA scale. Grades are available on MyConcordia.",
        "campus": "Concordia has two main campuses: Sir George Williams Campus downtown and Loyola Campus in Notre-Dame-de-Grâce.",
    },
    "UoFT": {
        "admission": "University of Toronto admission requires high academic standing, supplemental applications for some programs, and proof of English proficiency. Deadlines vary by program.",
        "tuition": "UofT tuition ranges from $6,000-$15,000 CAD for domestic students and $45,000-$60,000 for international students depending on program.",
        "registration": "Course selection at UofT is done through ACORN. Priority enrollment times are assigned based on year of study and program.",
        "grades": "UofT uses percentage grades and letter grades. Official transcripts show both. View grades on ACORN portal.",
        "campus": "UofT has three campuses: St. George (downtown Toronto), Mississauga, and Scarborough.",
    },
    "UBC": {
        "admission": "UBC admission requirements include academic excellence, personal profile, and standardized tests for some programs. Application deadline is January 15th.",
        "tuition": "UBC tuition is approximately $5,000-$10,000 CAD for BC residents and $38,000-$55,000 for international students.",
        "registration": "Course registration at UBC is done through the Student Service Centre (SSC). Registration dates are assigned based on credit standing.",
        "grades": "UBC uses percentage grades with letter grade equivalents. View your grades on the SSC portal or Canvas.",
        "campus": "UBC has two main campuses: Vancouver campus and Okanagan campus in Kelowna.",
    },
    "McMaster": {
        "admission": "McMaster University requires high school transcripts, supplementary application for some programs, and proof of English proficiency. Application deadline is typically January 15th.",
        "tuition": "McMaster tuition fees are approximately $6,000-$12,000 CAD for Ontario residents and $28,000-$42,000 for international students.",
        "registration": "Course registration at McMaster is done through Mosaic. Registration appointments are assigned based on your year level and program.",
        "grades": "McMaster uses letter grades (A+, A, A-, B+, B, etc.) on a 12-point scale. Access grades through Mosaic.",
        "campus": "McMaster's main campus is located in Hamilton, Ontario, with additional facilities in downtown Hamilton and Burlington.",
    }
}


class QuestionRequest(BaseModel):
    school: str
    question: str


class QuestionResponse(BaseModel):
    answer: str
    keywords: List[str]


def extract_keywords(question: str) -> List[str]:
    """
    Extract keywords from the question using simple text processing.
    In a production system, you might use NLP libraries like NLTK or spaCy.
    """
    # Remove common stop words
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
                  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'been', 'be',
                  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
                  'could', 'may', 'might', 'must', 'can', 'what', 'where', 'when', 
                  'why', 'how', 'which', 'who', 'about', 'into', 'through', 'during'}
    
    # Convert to lowercase and split
    words = re.findall(r'\b\w+\b', question.lower())
    
    # Filter out stop words and short words, keep only meaningful keywords
    keywords = [word for word in words if word not in stop_words and len(word) > 2]
    
    # Remove duplicates while preserving order
    seen = set()
    unique_keywords = []
    for word in keywords:
        if word not in seen:
            seen.add(word)
            unique_keywords.append(word)
    
    return unique_keywords


def find_relevant_info(school: str, keywords: List[str]) -> str:
    """
    Find relevant information based on keywords.
    Matches keywords to topics in the knowledge base.
    """
    if school not in SCHOOL_KNOWLEDGE_BASE:
        return f"I don't have information about {school}. Please select a valid school."
    
    knowledge = SCHOOL_KNOWLEDGE_BASE[school]
    relevant_topics = []
    
    # Map keywords to topics
    keyword_topic_map = {
        'admission': ['admission', 'apply', 'application', 'admit', 'acceptance', 'requirements', 'deadline'],
        'tuition': ['tuition', 'fee', 'cost', 'price', 'payment', 'financial', 'money'],
        'registration': ['registration', 'register', 'course', 'class', 'enrollment', 'enroll', 'signup'],
        'grades': ['grade', 'gpa', 'transcript', 'mark', 'score', 'academic', 'performance'],
        'campus': ['campus', 'location', 'address', 'building', 'facility', 'where']
    }
    
    # Find matching topics
    matched_topics = set()
    for topic, topic_keywords in keyword_topic_map.items():
        if any(keyword in topic_keywords for keyword in keywords):
            matched_topics.add(topic)
    
    # If no specific matches, try broader search
    if not matched_topics:
        # Check if any keyword appears in any topic description
        for topic, info in knowledge.items():
            topic_text = topic + ' ' + info.lower()
            if any(keyword in topic_text for keyword in keywords):
                matched_topics.add(topic)
    
    # Get information for matched topics
    if matched_topics:
        answers = []
        for topic in matched_topics:
            if topic in knowledge:
                answers.append(knowledge[topic])
        return ' '.join(answers)
    else:
        # Default response if no specific match
        return f"Thank you for your question about {school}. Here is some general information: {list(knowledge.values())[0]}. For more specific information, please contact the school directly or visit their official website."
    

@app.get("/")
def read_root():
    return {"message": "School Assistant API is running"}


@app.post("/api/question", response_model=QuestionResponse)
async def process_question(request: QuestionRequest):
    """
    Process a question by extracting keywords and finding relevant information.
    """
    try:
        # Extract keywords from the question
        keywords = extract_keywords(request.question)
        
        # Find relevant information
        answer = find_relevant_info(request.school, keywords)
        
        # If no keywords extracted, provide a general response
        if not keywords:
            answer = f"Thank you for your question about {request.school}. For detailed information about procedures, please visit the school's official website or contact their admissions office directly."
        
        return QuestionResponse(
            answer=answer,
            keywords=keywords
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")


@app.get("/api/schools")
def get_schools():
    """Get list of available schools"""
    return {"schools": list(SCHOOL_KNOWLEDGE_BASE.keys())}