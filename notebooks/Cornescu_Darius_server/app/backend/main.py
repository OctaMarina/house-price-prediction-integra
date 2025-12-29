from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import router
from . import storage
import os

app = FastAPI( title="House Price Prediction API" )

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8000"

    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Starting House Price Prediction API\n")
    storage.preload_pipeline()

app.include_router(router)

@app.get("/api")
async def root():
    return {"message": "House Price Prediction API"}
