from fastapi import FastAPI
from .routes import router
from . import storage

app = FastAPI( title="House Price Prediction API" )

@app.on_event("startup")
async def startup_event():
    print("Starting House Price Prediction API\n")
    storage.preload_pipeline()

app.include_router(router)


@app.get("/")
async def root():
    return {"message": "House Price Prediction API"}