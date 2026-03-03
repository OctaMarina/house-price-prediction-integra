import joblib
from pathlib import Path
from typing import Any

_pipeline_cache: dict[str, Any] = {}


def load_pipeline(pipeline_path: str = "ml_models/complete_pipeline.joblib"):
    if pipeline_path in _pipeline_cache:
        return _pipeline_cache[pipeline_path]
    
    path = Path(pipeline_path)
    if not path.exists():
        raise FileNotFoundError(f"Pipeline not found: {path}")
    
    pipeline = joblib.load(path)
    
    _pipeline_cache[pipeline_path] = pipeline
    print(f"Loaded complete pipeline from {path}")
    
    return pipeline


def get_pipeline(): return load_pipeline()


def preload_pipeline():

    try:
        load_pipeline()
        print(" Pipeline preloaded successfully")
    except FileNotFoundError as e:
        print(f" Failed to preload pipeline: {e}")
        raise