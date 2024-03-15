from typing import List, Optional
from fastapi import FastAPI, File, Form, HTTPException,Query, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from service.service import Feedback, create_metadata, createFeedback, read_category, read_model_data, read_question, test_model_v1, test_model_v2
from ciaos import save,get
from config import AppConfig

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/uploadfiles/")
async def update_file(category: Optional[str] = Form(None), image: List[str] = Form(...)):
    try:
        save(AppConfig.STORAGE_BASE_URL, category, image)
        return JSONResponse(content={"message": f"Image saved locally at: {category}"}, status_code=200)
    except HTTPException as e:
        return JSONResponse(content={"error": str(e.detail)}, status_code=e.status_code)

@app.get("/get_images/{category}")
async def get_images(category: str):
    try:
        images = get(AppConfig.STORAGE_BASE_URL, category)
        return images
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/test_model")
async def test_model(base64: str = Query(..., description="Base64-encoded image data"), model_name: str = Query(..., description="Name of the model to use")):
   return test_model_v1(base64, model_name)

@app.post("/test_model_v2")
async def upload_file(file: UploadFile = File(...)):
    return test_model_v2(file)

@app.post("/feedback")
async def create_feedback(feedback:Feedback):
    return createFeedback(feedback)


@app.get("/select_option")
async def select_option(query:str):
    if query=="model":
        return read_model_data()
    elif query=="category":
        return read_category()
    elif query=="question":
        return read_question()
    elif query=="imageMetadata":
        return create_metadata()


