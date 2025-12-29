import { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import HousePredictionForm from './components/HousePredictionForm'
import PredictionResult from './components/PredictionResult'
import PredictionHistory from './components/PredictionHistory'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('predictionHistory')
    return saved ? JSON.parse(saved) : []
  })

  const handlePrediction = (result, inputData) => {
    setPrediction(result)
    
    // Adding to history
    const newEntry = { id: Date.now(), timestamp: new Date().toISOString(), input: inputData, prediction: result.predicted_price }
    const updatedHistory = [newEntry, ...history].slice(0, 10) 
    setHistory(updatedHistory)
    localStorage.setItem('predictionHistory', JSON.stringify(updatedHistory))
  }

  const handleLoadHistory = (entry) => { return entry.input }

  const handleClearHistory = () => {
    setHistory([])
    localStorage.removeItem('predictionHistory')
  }

  return (
    <div className="App">
      <Container fluid className="py-4">
        <Row className="mb-5">
          <Col>
            <div className="text-center">
              <h1>House Price Prediction</h1>
              <p className="text-muted">
                Get accurate price estimates powered by machine learning
              </p>
            </div>
          </Col>
        </Row>
        
        <Row>
          <Col lg={8} className="mb-4">
            <HousePredictionForm
              onPrediction={handlePrediction}
              loading={loading}
              setLoading={setLoading}
              error={error}
              setError={setError}
            />
          </Col>
          
          <Col lg={4}>
            {prediction && (
              <div className="mb-4">
                <PredictionResult prediction={prediction} />
              </div>
            )}
            
            {history.length > 0 && (
              <PredictionHistory
                history={history}
                onLoad={handleLoadHistory}
                onClear={handleClearHistory}
              />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default App

