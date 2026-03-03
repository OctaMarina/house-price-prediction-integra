import axios from 'axios'

export interface HousePredictionInput {
  OverallQual: number
  GrLivArea: number
  '1stFlrSF': number
  FullBath: number
  TotRmsAbvGrd: number
  YearBuilt: number
  LotArea: number
  KitchenQual: string
  Foundation: string
  ExterQual: string
  Neighborhood: string
  YearRemodAdd?: number
  GarageYrBlt?: number
  GarageCars?: number
  GarageArea?: number
  TotalBsmtSF?: number
  MasVnrArea?: number
  Fireplaces?: number
  LotFrontage?: number
  '2ndFlrSF'?: number
  HalfBath?: number
  HeatingQC?: string
  Electrical?: string
}

export interface PredictionOutput {
  predicted_price: number
}

const apiClient = axios.create({
  baseURL: window.location.origin,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

console.log('API Client BaseURL:', apiClient.defaults.baseURL)

export const predictHousePrice = async (data: HousePredictionInput): Promise<PredictionOutput> => {
  try {
    console.log('Sending prediction request with data:', data)

    const response = await apiClient.post<PredictionOutput>('/predict', data)

    console.log('Prediction response:', response.data)
    return response.data
  } catch (error) {
    console.error('Prediction error:', error)

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        const detail = (error.response.data as any)?.detail || 'Invalid input data'
        throw new Error(detail)
      }
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new Error('Cannot connect to backend at http://localhost:8000. Make sure FastAPI server is running.')
      }
      if (error.message.includes('timeout')) {
        throw new Error('Request timeout. Backend server may not be responding.')
      }

      const errorMessage = (error.response?.data as any)?.detail || error.message || 'Failed to get prediction'
      throw new Error(errorMessage)
    }

    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health')
    console.log('Health check successful:', response.data)
    return true
  } catch (error) {
    console.error('Health check failed:', error)
    return false
  }
}