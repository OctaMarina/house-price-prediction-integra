import joblib
from pathlib import Path
from typing import Any

class ModelRepository:

    def __init__(self, model_path: str = "ml_models/complete_pipeline.joblib"):

        self.model_path = Path(model_path)
        self._model: Any = None
    
    def load_model(self):

        if self._model is not None: return self._model
        if not self.model_path.exists(): 
            raise FileNotFoundError(f"Model not found: {self.model_path}")
        
        self._model = joblib.load(self.model_path)
        print(f"Loaded regression model from {self.model_path}")
        
        return self._model
    
    def get_model(self): return self.load_model()

model_repository = ModelRepository()