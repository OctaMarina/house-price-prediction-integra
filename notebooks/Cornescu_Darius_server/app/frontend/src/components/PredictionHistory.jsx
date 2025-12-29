import { Card, ListGroup, Button, Badge } from 'react-bootstrap'

function PredictionHistory({ history, onLoad, onClear }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span style={{ fontWeight: 600, fontSize: '1rem' }}>Recent Predictions</span>
        <Button variant="outline-danger" size="sm" onClick={onClear}>
          Clear All
        </Button>
      </Card.Header>
      <ListGroup variant="flush" style={{ maxHeight: '450px', overflowY: 'auto' }}>
        {history.map((entry) => (
          <ListGroup.Item key={entry.id} className="history-item">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="flex-grow-1">
                <Badge bg="success" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  {formatPrice(entry.prediction)}
                </Badge>
                <div className="small text-muted mt-1" style={{ fontSize: '0.8rem' }}>
                  {formatDate(entry.timestamp)}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--lavender-grey)' }}>
              <div className="d-flex justify-content-between mb-1">
                <span>Living Area:</span>
                <span style={{ fontWeight: 500, color: 'var(--space-indigo)' }}>
                  {entry.input.GrLivArea} sq ft
                </span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Quality:</span>
                <span style={{ fontWeight: 500, color: 'var(--space-indigo)' }}>
                  {entry.input.OverallQual}/10
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Built:</span>
                <span style={{ fontWeight: 500, color: 'var(--space-indigo)' }}>
                  {entry.input.YearBuilt}
                </span>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  )
}

export default PredictionHistory

