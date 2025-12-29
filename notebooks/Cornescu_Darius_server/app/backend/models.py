from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Optional, Literal


class HousePredictionInput(BaseModel):

    # ============ MANDATORY FIELDS ============
    OverallQual: int = Field(ge=1, le=10, description="Overall quality (1-10)")
    GrLivArea: int = Field(gt=0, description="Living area sq ft")
    FirstFlrSF: int = Field(gt=0, alias='1stFlrSF', description="First floor sq ft")
    FullBath: int = Field(ge=0, le=5, description="Full bathrooms above grade")
    TotRmsAbvGrd: int = Field(ge=0, le=20, description="Total rooms above grade")
    YearBuilt: int = Field(ge=1800, le=2025, description="Year built")
    LotArea: int = Field(gt=0, description="Lot size sq ft")
    
    KitchenQual: Literal['Ex', 'Gd', 'TA', 'Fa', 'Po'] = Field(description="Kitchen quality")
    Foundation: Literal['PConc', 'CBlock', 'BrkTil', 'Slab', 'Stone', 'Wood'] = Field(description="Foundation type")
    ExterQual: Literal['Ex', 'Gd', 'TA', 'Fa', 'Po'] = Field(description="Exterior quality")
    Neighborhood: str = Field(min_length=1, description="Neighborhood name")
    
    # ============ OPTIONAL FIELDS ============
    YearRemodAdd: Optional[int] = Field(None, ge=1800, le=2025, description="Remodel year")
    GarageYrBlt: Optional[int] = Field(None, ge=1800, le=2025, description="Garage year built")
    GarageCars: Optional[int] = Field(None, ge=0, le=5, description="Garage car capacity")
    GarageArea: Optional[int] = Field(None, ge=0, description="Garage area sq ft")
    TotalBsmtSF: Optional[int] = Field(None, ge=0, description="Basement area sq ft")
    MasVnrArea: Optional[int] = Field(None, ge=0, description="Masonry veneer area sq ft")
    Fireplaces: Optional[int] = Field(None, ge=0, le=5, description="Number of fireplaces")
    LotFrontage: Optional[int] = Field(None, gt=0, description="Street frontage linear ft")
    SecondFlrSF: Optional[int] = Field(None, ge=0, alias='2ndFlrSF', description="Second floor sq ft")
    HalfBath: Optional[int] = Field(None, ge=0, le=3, description="Half baths above grade")
    HeatingQC: Optional[Literal['Ex', 'Gd', 'TA', 'Fa', 'Po']] = Field(None, description="Heating quality")
    Electrical: Optional[Literal['SBrkr', 'FuseA', 'FuseF', 'FuseP', 'Mix']] = Field(None, description="Electrical system")
    

    # ============ SEMANTIC VALIDATORS (Field-level) ============
    @field_validator('YearRemodAdd')
    @classmethod
    def validate_remodel_year(cls, value, info):
        if value is not None and 'YearBuilt' in info.data:
            if value < info.data['YearBuilt']:
                raise ValueError( f"YearRemodAdd ({value}) cannot be before YearBuilt ({info.data['YearBuilt']})" )
            
        return value
    
    @field_validator('GarageYrBlt')
    @classmethod
    def validate_garage_year(cls, value, info):
        if value is not None and 'YearBuilt' in info.data:
            if value < info.data['YearBuilt'] - 1:
                raise ValueError( f"GarageYrBlt ({value}) cannot be significantly before YearBuilt ({info.data['YearBuilt']})" )
            
        return value
    

    # ============ LOGICAL VALIDATORS (Model-level - Intuitive Correlations) ============
    @model_validator(mode='after')
    def validate_garage_features_consistency(self):
        """ If you have no garage, you shouldn't have garage-related features """

        garage_area = self.GarageArea or 0
        garage_cars = self.GarageCars or 0
        garage_year = self.GarageYrBlt
        
        if garage_area == 0:
            if garage_cars > 0:
                raise ValueError(f"Cannot have GarageCars ({garage_cars}) without GarageArea")
            if garage_year is not None:
                raise ValueError("Cannot have GarageYrBlt without GarageArea")
        
        if garage_area > 0 and garage_cars == 0:
            raise ValueError(f"GarageArea is {garage_area} sq ft but GarageCars is 0")
        
        if garage_cars > 0 and garage_area == 0:
            raise ValueError(f"GarageCars is {garage_cars} but GarageArea is 0")
        
        if garage_cars > 0 and garage_area > 0:
            area_per_car = garage_area / garage_cars
            if area_per_car < 100:
                raise ValueError(f"Garage too small: {area_per_car:.0f} sq ft per car (minimum 100 sq ft)")
            if area_per_car > 500:
                raise ValueError(f"Garage too large: {area_per_car:.0f} sq ft per car (maximum 500 sq ft)")
        
        return self
    
    @model_validator(mode='after')
    def validate_floor_areas_sum(self):
        """ First floor + Second floor should equal living area """

        first = self.FirstFlrSF
        second = self.SecondFlrSF or 0
        total_floors = first + second
        living_area = self.GrLivArea
        tolerance = living_area * 0.05
        
        if abs(total_floors - living_area) > tolerance:
            raise ValueError(
                f"Floor areas don't match: 1stFlr ({first}) + 2ndFlr ({second}) = {total_floors} "
                f"but GrLivArea is {living_area}"
            )
        
        return self
    
    @model_validator(mode='after')
    def validate_lot_size_vs_house_size(self):
        """ Lot must be bigger than the house """

        if self.LotArea <= self.GrLivArea:
            raise ValueError( f"LotArea ({self.LotArea} sq ft) must be larger than GrLivArea ({self.GrLivArea} sq ft)")
        
        return self
    
    @model_validator(mode='after')
    def validate_bathrooms_vs_rooms(self):
        """ Can't have more bathrooms than total rooms """

        full = self.FullBath
        half = self.HalfBath or 0
        total_bath_units = full + (half * 0.5)

        if total_bath_units > self.TotRmsAbvGrd:
            raise ValueError(
                f"Too many bathrooms: {full} full + {half} half = {total_bath_units} units, "
                f"but only {self.TotRmsAbvGrd} total rooms"
            )
        
        if total_bath_units >= self.TotRmsAbvGrd:
            raise ValueError( "House must have at least one non-bathroom room")
        
        return self
    
    @model_validator(mode='after')
    def validate_basement_vs_first_floor(self):
        """ Basement usually similar size to first floor """

        if self.TotalBsmtSF is not None and self.TotalBsmtSF > 0:
            max_reasonable = self.FirstFlrSF * 1.5
            
            if self.TotalBsmtSF > max_reasonable:
                raise ValueError(
                    f"Basement ({self.TotalBsmtSF} sq ft) unusually large compared to "
                    f"first floor ({self.FirstFlrSF} sq ft)"
                )
        
        return self
    
    @model_validator(mode='after')
    def validate_quality_consistency(self):
        """ Overall quality should match component qualities """

        overall = self.OverallQual
        kitchen = self.KitchenQual
        exterior = self.ExterQual
        
        if overall >= 8:
            if kitchen in ['Fa', 'Po']:
                raise ValueError( f"Overall quality is high ({overall}/10) but kitchen quality is poor ({kitchen})")
            if exterior in ['Fa', 'Po']:
                raise ValueError( f"Overall quality is high ({overall}/10) but exterior quality is poor ({exterior})" )
        
        if overall <= 3:
            if kitchen == 'Ex':
                raise ValueError( f"Overall quality is low ({overall}/10) but kitchen quality is excellent" )
            if exterior == 'Ex':
                raise ValueError( f"Overall quality is low ({overall}/10) but exterior quality is excellent" )
        
        return self
    
    @model_validator(mode='after')
    def validate_recent_construction_quality(self):
        """ Recently built houses should have modern electrical systems """

        if self.YearBuilt >= 1990:
            if self.Electrical in ['FuseP', 'FuseF']:
                raise ValueError(
                    f"House built in {self.YearBuilt} shouldn't have outdated fuse electrical system ({self.Electrical}). "
                    "Modern homes typically have circuit breakers (SBrkr)"
                )
        
        return self


class PredictionOutput(BaseModel):
    predicted_price: float = Field(description="Predicted house price in USD")
    