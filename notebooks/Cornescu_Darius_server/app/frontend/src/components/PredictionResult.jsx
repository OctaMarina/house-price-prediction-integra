import { Card } from 'react-bootstrap'

function PredictionResult({ prediction }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="prediction-result">
      <Card.Body className="p-4">
        <div className="text-center">
          <p className="text-muted mb-2" style={{ fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Estimated Value
          </p>
          <div className="price-display">
            {formatPrice(prediction.predicted_price)}
          </div>
          <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
            Based on current market analysis
          </p>
        </div>
      </Card.Body>
    </Card>
  )
}

export default PredictionResult

