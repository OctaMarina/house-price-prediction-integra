// Field-level validators
export const validateOverallQual = (value) => {
  const num = parseInt(value)
  if (isNaN(num) || num < 1 || num > 10) { return 'Overall quality must be between 1 and 10' }
  return null
}

export const validateYear = (value, fieldName = 'Year') => {
  const num = parseInt(value)
  if (isNaN(num) || num < 1800 || num > 2025) { return `${fieldName} must be between 1800 and 2025` }
  return null
}

export const validatePositiveNumber = (value, fieldName = 'Value') => {
  const num = parseInt(value)
  if (isNaN(num) || num <= 0) { return `${fieldName} must be greater than 0` }
  return null
}

export const validateNonNegativeNumber = (value, fieldName = 'Value') => {
  const num = parseInt(value)
  if (isNaN(num) || num < 0) { return `${fieldName} must be 0 or greater` }
  return null
}

export const validateRange = (value, min, max, fieldName = 'Value') => {
  const num = parseInt(value)
  if (isNaN(num) || num < min || num > max) { return `${fieldName} must be between ${min} and ${max}` }
  return null
}

export const validateNeighborhood = (value) => {
  const validNeighborhoods = [
    'Blmngtn', 'Blueste', 'BrDale', 'BrkSide', 'ClearCr', 'CollgCr', 'Crawfor',
    'Edwards', 'Gilbert', 'IDOTRR', 'MeadowV', 'Mitchel', 'NAmes', 'NoRidge',
    'NPkVill', 'NridgHt', 'NWAmes', 'OldTown', 'SWISU', 'Sawyer', 'SawyerW',
    'Somerst', 'StoneBr', 'Timber', 'Veenker'
  ]
  
  if (!value || value === '') { return 'Please select a neighborhood' }
  if (!validNeighborhoods.includes(value)) { return 'Invalid neighborhood selected' }
  return null
}

// Cross-field validators
export const validateYearRemodAdd = (yearRemodAdd, yearBuilt) => {

  if (!yearRemodAdd) return null
  const remod = parseInt(yearRemodAdd)
  const built = parseInt(yearBuilt)
  if (remod < built) { return `Remodel year (${remod}) cannot be before year built (${built})` }
  return null
}

export const validateGarageYrBlt = (garageYear, yearBuilt) => {

  if (!garageYear) return null
  const garage = parseInt(garageYear)
  const built = parseInt(yearBuilt)
  if (garage < built - 1) { return `Garage year (${garage}) cannot be significantly before year built (${built})` } 
  return null
}

export const validateGarageConsistency = (garageArea, garageCars, garageYear) => {

  const area = parseInt(garageArea) || 0
  const cars = parseInt(garageCars) || 0
  
  if (area === 0) {
    if (cars > 0) { return 'Cannot have garage cars without garage area' }
    if (garageYear) { return 'Cannot have garage year without garage area' }
  }
  
  if (area > 0 && cars === 0) { return `Garage area is ${area} sq ft but garage cars is 0` }
  if (cars > 0 && area === 0) { return `Garage cars is ${cars} but garage area is 0` }
  
  if (cars > 0 && area > 0) {
    const areaPerCar = area / cars
    if (areaPerCar < 100) { return `Garage too small: ${Math.round(areaPerCar)} sq ft per car (minimum 100 sq ft)` }
    if (areaPerCar > 500) { return `Garage too large: ${Math.round(areaPerCar)} sq ft per car (maximum 500 sq ft)` }
  }
  return null
}

export const validateFloorAreas = (firstFlrSF, secondFlrSF, grLivArea) => {
  const first = parseInt(firstFlrSF) || 0
  const second = parseInt(secondFlrSF) || 0
  const living = parseInt(grLivArea) || 0
  
  const totalFloors = first + second
  const tolerance = living * 0.05
  
  if (Math.abs(totalFloors - living) > tolerance) { return `Floor areas don't match: 1st (${first}) + 2nd (${second}) = ${totalFloors} but living area is ${living}` }
  return null
}

export const validateLotSize = (lotArea, grLivArea) => {
  const lot = parseInt(lotArea) || 0
  const living = parseInt(grLivArea) || 0
  
  if (lot <= living) { return `Lot area (${lot} sq ft) must be larger than living area (${living} sq ft)` }
  return null
}

export const validateBathrooms = (fullBath, halfBath, totRmsAbvGrd) => {
  const full = parseInt(fullBath) || 0
  const half = parseInt(halfBath) || 0
  const totalRooms = parseInt(totRmsAbvGrd) || 0
  
  const totalBathUnits = full + (half * 0.5)
  
  if (totalBathUnits > totalRooms) { return `Too many bathrooms: ${full} full + ${half} half = ${totalBathUnits} units, but only ${totalRooms} total rooms` }
  if (totalBathUnits >= totalRooms) { return 'House must have at least one non-bathroom room' }  
  return null
}

export const validateBasement = (totalBsmtSF, firstFlrSF) => {
  if (!totalBsmtSF || totalBsmtSF === 0) return null
  
  const basement = parseInt(totalBsmtSF)
  const first = parseInt(firstFlrSF)
  const maxReasonable = first * 1.5
  
  if (basement > maxReasonable) { return `Basement (${basement} sq ft) unusually large compared to first floor (${first} sq ft)` }
  return null
}

export const validateQualityConsistency = (overallQual, kitchenQual, exterQual) => {
  const overall = parseInt(overallQual)
  
  if (overall >= 8) {
    if (kitchenQual === 'Fa' || kitchenQual === 'Po') { return `Overall quality is high (${overall}/10) but kitchen quality is poor (${kitchenQual})` } 
    if (exterQual === 'Fa' || exterQual === 'Po') { return `Overall quality is high (${overall}/10) but exterior quality is poor (${exterQual})` }
  }
  
  if (overall <= 3) {
    if (kitchenQual === 'Ex') { return `Overall quality is low (${overall}/10) but kitchen quality is excellent` }
    if (exterQual === 'Ex') { return `Overall quality is low (${overall}/10) but exterior quality is excellent` }
  }
  
  return null
}

export const validateRecentConstruction = (yearBuilt, electrical) => {
  const year = parseInt(yearBuilt)
  
  if (year >= 1990) {
    if (electrical === 'FuseP' || electrical === 'FuseF') { return `House built in ${year} shouldn't have outdated fuse electrical system (${electrical}). Modern homes typically have circuit breakers (SBrkr)`}
  }
  
  return null
}

// Comprehensive validation function
export const validateAllFields = (formData) => {
  const errors = {}
  
  // Mandatory field validations
  if (formData.OverallQual) {
    const error = validateOverallQual(formData.OverallQual)
    if (error) errors.OverallQual = error
  }
  
  if (formData.YearBuilt) {
    const error = validateYear(formData.YearBuilt, 'Year built')
    if (error) errors.YearBuilt = error
  }
  
  if (formData.GrLivArea) {
    const error = validatePositiveNumber(formData.GrLivArea, 'Living area')
    if (error) errors.GrLivArea = error
  }
  
  if (formData.FirstFlrSF) {
    const error = validatePositiveNumber(formData.FirstFlrSF, 'First floor area')
    if (error) errors.FirstFlrSF = error
  }
  
  if (formData.LotArea) {
    const error = validatePositiveNumber(formData.LotArea, 'Lot area')
    if (error) errors.LotArea = error
  }
  
  // Neighborhood validation
  const neighborhoodError = validateNeighborhood(formData.Neighborhood)
  if (neighborhoodError) errors.Neighborhood = neighborhoodError
  
  // Cross-field validations
  if (formData.YearRemodAdd && formData.YearBuilt) {
    const error = validateYearRemodAdd(formData.YearRemodAdd, formData.YearBuilt)
    if (error) errors.YearRemodAdd = error
  }
  
  if (formData.GarageYrBlt && formData.YearBuilt) {
    const error = validateGarageYrBlt(formData.GarageYrBlt, formData.YearBuilt)
    if (error) errors.GarageYrBlt = error
  }
  
  const garageError = validateGarageConsistency(
    formData.GarageArea,
    formData.GarageCars,
    formData.GarageYrBlt
  )
  if (garageError) {
    errors.GarageArea = garageError
    errors.GarageCars = garageError
  }
  
  if (formData.FirstFlrSF && formData.GrLivArea) {
    const error = validateFloorAreas(
      formData.FirstFlrSF,
      formData.SecondFlrSF,
      formData.GrLivArea
    )
    if (error) errors.SecondFlrSF = error
  }
  
  if (formData.LotArea && formData.GrLivArea) {
    const error = validateLotSize(formData.LotArea, formData.GrLivArea)
    if (error) errors.LotArea = error
  }
  
  if (formData.FullBath && formData.TotRmsAbvGrd) {
    const error = validateBathrooms(
      formData.FullBath,
      formData.HalfBath,
      formData.TotRmsAbvGrd
    )
    if (error) errors.FullBath = error
  }
  
  if (formData.TotalBsmtSF && formData.FirstFlrSF) {
    const error = validateBasement(formData.TotalBsmtSF, formData.FirstFlrSF)
    if (error) errors.TotalBsmtSF = error
  }
  
  if (formData.OverallQual && formData.KitchenQual && formData.ExterQual) {
    const error = validateQualityConsistency(
      formData.OverallQual,
      formData.KitchenQual,
      formData.ExterQual
    )
    if (error) errors.OverallQual = error
  }
  
  if (formData.YearBuilt && formData.Electrical) {
    const error = validateRecentConstruction(formData.YearBuilt, formData.Electrical)
    if (error) errors.Electrical = error
  }
  
  return errors
}

