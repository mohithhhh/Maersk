from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import query

app = FastAPI(title="Maersk AI Copilot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "🚀 Maersk AI Backend is running!"}

app.include_router(query.router, prefix="/api")