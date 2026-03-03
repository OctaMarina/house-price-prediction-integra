import joblib
import numpy as np
import pandas as pd

from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from xgboost import XGBRegressor


from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[4]
csv_path = BASE_DIR / "house_prices.csv"

df = pd.read_csv(csv_path)

print(df.columns.tolist())

numerical_features = [
    'OverallQual', 'GrLivArea', 'GarageCars', 'GarageArea', 'TotalBsmtSF',
    '1stFlrSF', 'FullBath', 'TotRmsAbvGrd', 'YearBuilt', 'YearRemodAdd',
    'GarageYrBlt', 'MasVnrArea', 'Fireplaces', 'LotFrontage', '2ndFlrSF',
    'HalfBath', 'LotArea'
]

categorical_features = [
    'KitchenQual', 'Foundation', 'ExterQual', 'HeatingQC',
    'Neighborhood', 'Electrical'
]

X_raw = df[numerical_features + categorical_features]
y = df['SalePrice']


X_train_raw, X_test_raw, Y_train, Y_test = train_test_split(
    X_raw, y, test_size=0.20, random_state=42
)


preprocessor = ColumnTransformer(
    transformers=[
        ('num', Pipeline([
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler())
        ]), numerical_features),

        ('cat', Pipeline([
            ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
            ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
        ]), categorical_features)
    ]
)


complete_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', XGBRegressor(
        n_estimators=300,
        learning_rate=0.1,
        max_depth=3,
        min_child_weight=1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        objective='reg:squarederror'
    ))
])


print("Training complete pipeline...")
complete_pipeline.fit(X_train_raw, Y_train)


y_pred = complete_pipeline.predict(X_test_raw)

mae = mean_absolute_error(Y_test, y_pred)
rmse = np.sqrt(mean_squared_error(Y_test, y_pred))
r2 = r2_score(Y_test, y_pred)

print(f"MAE: ${mae:,.0f}")
print(f"RMSE: ${rmse:,.0f}")
print(f"R²: {r2:.4f}")


joblib.dump(complete_pipeline, "complete_pipeline.joblib")
print("Complete pipeline saved!")


loaded_pipeline = joblib.load("complete_pipeline.joblib")
test_pred = loaded_pipeline.predict(X_test_raw.iloc[[0]])
print(f"Test prediction: ${test_pred[0]:,.0f}")
