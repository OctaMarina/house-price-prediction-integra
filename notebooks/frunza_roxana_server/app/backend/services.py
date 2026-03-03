import pandas as pd
from .models import HousePredictionInput, PredictionOutput
from . import storage


def predict_house_price(input_data: HousePredictionInput):
    df = _to_dataframe(input_data)

    print("INPUT DATAFRAME:")
    print(df)
    print("DTYPES:")
    print(df.dtypes)

    pipeline = storage.get_pipeline()
    prediction = pipeline.predict(df)
    price = max(0, float(prediction[0]))

    return PredictionOutput(predicted_price=price)



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

    df_data = {col: data_dict.get(col, None) for col in all_columns}

    df = pd.DataFrame([df_data])

    numeric_cols = [
        'OverallQual','GrLivArea','1stFlrSF','FullBath','TotRmsAbvGrd',
        'YearBuilt','LotArea','YearRemodAdd','GarageYrBlt','GarageCars',
        'GarageArea','TotalBsmtSF','MasVnrArea','Fireplaces','LotFrontage',
        '2ndFlrSF','HalfBath'
    ]

    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    return df
