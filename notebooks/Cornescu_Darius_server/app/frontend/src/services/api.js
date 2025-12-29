import axios from 'axios'
const API_BASE_URL = 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const predictHousePrice = async (houseData) => {
  try {
    // Transform field names to match backend aliases
    const transformedData = {
      ...houseData,
      '1stFlrSF': houseData.FirstFlrSF,
      '2ndFlrSF': houseData.SecondFlrSF || null,
    }
    
    // Remove the non-aliased versions
    delete transformedData.FirstFlrSF
    delete transformedData.SecondFlrSF
    
    const response = await apiClient.post('/predict', transformedData)
    return response.data
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.detail || 'Prediction failed')
    } else if (error.request) {
      // Request made but no response
      throw new Error('Unable to connect to server. Please ensure the backend is running.')
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred')
    }
  }
}

export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health')
    return response.data
  } catch (error) {
    throw new Error('Health check failed')
  }
}

export default apiClient

