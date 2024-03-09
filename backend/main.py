from fastapi import FastAPI, Query, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel 
from base64 import b64decode
import requests
from config import AppConfig 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test_model")
async def test_model(base64: str = Query(..., description="Base64-encoded image data"), model_name: str = Query(..., description="Name of the model to use")):
   

    if not all([base64, model_name]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing required parameters: base64 and model_name")

    try:
        image_data = b64decode(base64)
        data = {"image": ("image", image_data), "model_name": model_name}
        response = requests.post(f"{AppConfig.MAS_SERVICE_URL}{AppConfig.MAS_SERVICE_ENDPOINT}", data=data)  # Using AppConfig to access attributes
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)

    except (ValueError, requests.exceptions.RequestException) as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error sending request to MAS service: {str(e)}")
