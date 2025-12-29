import { Card, Accordion } from 'react-bootstrap'

function FormSection({ title, children, collapsible = false, defaultOpen = true, eventKey }) {
  if (collapsible) {
    return (
      <Accordion.Item eventKey={eventKey}>
        <Accordion.Header>{title}</Accordion.Header>
        <Accordion.Body>
          {children}
        </Accordion.Body>
      </Accordion.Item>
    )
  }

  return (
    <div className="mb-4">
      <h5 className="mb-3" style={{ 
        fontSize: '1.1rem', 
        fontWeight: 600, 
        color: 'var(--space-indigo)',
        letterSpacing: '-0.01em'
      }}>
        {title}
      </h5>
      {children}
    </div>
  )
}

export default FormSection

