from fastapi import APIRouter, HTTPException
from .models import HousePredictionInput, PredictionOutput
from . import services

router = APIRouter()

@router.post("/predict", response_model=PredictionOutput)
def route_predict_price(house_data: HousePredictionInput):

    try:
        result = services.predict_house_price(house_data)
        return result
     
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/health")
def route_health_check():
    return {
        "status": "healthy",
        "service": "house-price-prediction"
    }