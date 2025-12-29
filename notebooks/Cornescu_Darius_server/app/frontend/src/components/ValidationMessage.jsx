import { Alert } from 'react-bootstrap'

function ValidationMessage({ message, type = 'danger' }) {
  if (!message) return null
  
  return (
    <div className="invalid-feedback d-block">
      {message}
    </div>
  )
}

export default ValidationMessage

