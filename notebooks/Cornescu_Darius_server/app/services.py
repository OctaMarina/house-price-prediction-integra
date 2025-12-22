import pandas as pd
from .models import HousePredictionInput, PredictionOutput
from . import storage


def predict_house_price(input_data: HousePredictionInput):

    df = _to_dataframe(input_data)
    print(f"DEBUG: DataFrame shape: {df.shape}") 
    print(f"DEBUG: Columns: {list(df.columns)}")

    pipeline = storage.get_pipeline()
    prediction = pipeline.predict(df)

    return PredictionOutput(predicted_price=float(prediction[0]))


def _to_dataframe(data: HousePredictionInput):
    data_dict = data.model_dump(by_alias=True)
    all_columns = [
        'OverallQual', 'GrLivArea', '1stFlrSF', 'FullBath',
        'TotRmsAbvGrd', 'YearBuilt', 'LotArea',
        'YearRemodAdd', 'GarageYrBlt', 'GarageCars', 'GarageArea',
        'TotalBsmtSF', 'MasVnrArea', 'Fireplaces', 'LotFrontage',
        '2ndFlrSF', 'HalfBath', 'KitchenQual', 'Foundation', 'ExterQual',
        'Neighborhood', 'HeatingQC', 'Electrical'
    ]
    
    df_data = {}
    for col in all_columns:
        df_data[col] = data_dict.get(col, None)
    
    df = pd.DataFrame([df_data])
    df = df[all_columns]
    
    return df