import eventlet
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import json
from socketio import AsyncServer
import socketio

app = FastAPI()
sio = AsyncServer(async_mode='asgi', cors_allowed_origins="*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@sio.on('connect')
async def websocket_connect(sid, environ):
    print(f"Client connected: {sid}")
    await sio.emit("models", read_model_data(), room=sid)
    await sio.emit("questions", read_questions_data(), room=sid)

@sio.on('disconnect')
async def websocket_disconnect(sid):
    print(f"Client disconnected: {sid}")

@app.get("/model")
async def read_model():
    models = read_model_data()
    return JSONResponse(content=models)

@app.get("/questions")
async def read_questions():
    questions = read_questions_data()
    return JSONResponse(content=questions)

# Mount Socket.IO application
app.mount("/socket.io", socketio.ASGIApp(sio))

if __name__ == "__main__":
    eventlet.wsgi.server(eventlet.listen(('0.0.0.0', 8000)), app)
