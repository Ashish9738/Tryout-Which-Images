from ast import List
from fastapi import Body, FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel 
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Feedback(BaseModel):
    question_id: str
    feedback: str

def read_model_data():
    try:
        with open('./models/models.json', 'r') as file:
            data = json.load(file)
        return data
    except Exception as e:
        print('Error reading models.json:', e)
        return []

def read_questions_data():
    try:
        with open('./models/questions.json', 'r') as file:
            data = json.load(file)
        return data
    except Exception as e:
        print('Error reading questions.json:', e)
        return []

@app.get("/models")
async def read_models():
    models = read_model_data()
    return JSONResponse(content=models)

@app.get("/feedback")
async def read_questions():
    questions = read_questions_data()
    return JSONResponse(content=questions)

@app.post("/feedback")
async def recieving_feedback():
    return {"message": "Question received successfully"}


