import { useState, useEffect } from 'react'
import { Card, Form, Button, Row, Col, Alert, Spinner, Accordion } from 'react-bootstrap'
import { predictHousePrice } from '../services/api'
import { validateAllFields } from '../utils/validators'
import ValidationMessage from './ValidationMessage'
import FormSection from './FormSection'

function HousePredictionForm({ onPrediction, loading, setLoading, error, setError }) {
  const [formData, setFormData] = useState({
    // Mandatory fields
    OverallQual: '7',
    GrLivArea: '',
    FirstFlrSF: '',
    FullBath: '2',
    TotRmsAbvGrd: '6',
    YearBuilt: '2000',
    LotArea: '',
    KitchenQual: 'TA',
    Foundation: 'PConc',
    ExterQual: 'TA',
    Neighborhood: 'NAmes',
    
    // Optional fields
    YearRemodAdd: '',
    GarageYrBlt: '',
    GarageCars: '',
    GarageArea: '',
    TotalBsmtSF: '',
    MasVnrArea: '',
    Fireplaces: '0',
    LotFrontage: '',
    SecondFlrSF: '',
    HalfBath: '0',
    HeatingQC: '',
    Electrical: '',
  })

  const [validationErrors, setValidationErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
  }

  // Validate on form data change
  useEffect(() => {
    const errors = validateAllFields(formData)
    setValidationErrors(errors)
  }, [formData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    // Mark all fields as touched
    const allTouched = {}
    Object.keys(formData).forEach(key => {
      allTouched[key] = true
    })
    setTouched(allTouched)
    
    // Check for validation errors
    if (Object.keys(validationErrors).length > 0) {
      setError('Please fix validation errors before submitting')
      return
    }
    
    // Check mandatory fields
    const mandatoryFields = [
      'OverallQual', 'GrLivArea', 'FirstFlrSF', 'FullBath', 
      'TotRmsAbvGrd', 'YearBuilt', 'LotArea', 'KitchenQual',
      'Foundation', 'ExterQual', 'Neighborhood'
    ]
    
    const missingFields = mandatoryFields.filter(field => !formData[field])
    if (missingFields.length > 0) {
      setError(`Please fill in all mandatory fields: ${missingFields.join(', ')}`)
      return
    }
    
    setLoading(true)
    
    try {
      // Prepare data for API (convert empty strings to null for optional fields)
      const apiData = {}
      Object.keys(formData).forEach(key => {
        const value = formData[key]
        if (value === '' || value === null) {
          apiData[key] = null
        } else if (['OverallQual', 'GrLivArea', 'FirstFlrSF', 'FullBath', 'TotRmsAbvGrd', 
                    'YearBuilt', 'LotArea', 'YearRemodAdd', 'GarageYrBlt', 'GarageCars',
                    'GarageArea', 'TotalBsmtSF', 'MasVnrArea', 'Fireplaces', 'LotFrontage',
                    'SecondFlrSF', 'HalfBath'].includes(key)) {
          apiData[key] = parseInt(value) || null
        } else {
          apiData[key] = value
        }
      })
      
      const result = await predictHousePrice(apiData)
      onPrediction(result, apiData)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getFieldError = (fieldName) => {
    return touched[fieldName] ? validationErrors[fieldName] : null
  }

  const isFieldInvalid = (fieldName) => {
    return touched[fieldName] && validationErrors[fieldName]
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
          Property Information
        </Card.Title>
        
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <FormSection title="Essential Details">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Overall Quality (1-10) <span className="text-danger">*</span></Form.Label>
                  <Form.Range
                    name="OverallQual"
                    value={formData.OverallQual}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    className={isFieldInvalid('OverallQual') ? 'is-invalid' : ''}
                  />
                  <div className="text-center mt-1">
                    <strong>{formData.OverallQual}</strong>
                  </div>
                  <ValidationMessage message={getFieldError('OverallQual')} />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Year Built <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="YearBuilt"
                    value={formData.YearBuilt}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., 2000"
                    isInvalid={isFieldInvalid('YearBuilt')}
                    required
                  />
                  <ValidationMessage message={getFieldError('YearBuilt')} />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Living Area (sq ft) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="GrLivArea"
                    value={formData.GrLivArea}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., 1500"
                    isInvalid={isFieldInvalid('GrLivArea')}
                    required
                  />
                  <ValidationMessage message={getFieldError('GrLivArea')} />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Floor Area (sq ft) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="FirstFlrSF"
                    value={formData.FirstFlrSF}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., 1000"
                    isInvalid={isFieldInvalid('FirstFlrSF')}
                    required
                  />
                  <ValidationMessage message={getFieldError('FirstFlrSF')} />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lot Area (sq ft) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="LotArea"
                    value={formData.LotArea}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., 8000"
                    isInvalid={isFieldInvalid('LotArea')}
                    required
                  />
                  <ValidationMessage message={getFieldError('LotArea')} />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Neighborhood <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="Neighborhood"
                    value={formData.Neighborhood}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={isFieldInvalid('Neighborhood')}
                    required
                  >
                    <option value="">Select a neighborhood...</option>
                    <option value="Blmngtn">Bloomington Heights</option>
                    <option value="Blueste">Bluestem</option>
                    <option value="BrDale">Briardale</option>
                    <option value="BrkSide">Brookside</option>
                    <option value="ClearCr">Clear Creek</option>
                    <option value="CollgCr">College Creek</option>
                    <option value="Crawfor">Crawford</option>
                    <option value="Edwards">Edwards</option>
                    <option value="Gilbert">Gilbert</option>
                    <option value="IDOTRR">Iowa DOT and Rail Road</option>
                    <option value="MeadowV">Meadow Village</option>
                    <option value="Mitchel">Mitchell</option>
                    <option value="NAmes">North Ames</option>
                    <option value="NoRidge">Northridge</option>
                    <option value="NPkVill">Northpark Villa</option>
                    <option value="NridgHt">Northridge Heights</option>
                    <option value="NWAmes">Northwest Ames</option>
                    <option value="OldTown">Old Town</option>
                    <option value="SWISU">South & West of Iowa State University</option>
                    <option value="Sawyer">Sawyer</option>
                    <option value="SawyerW">Sawyer West</option>
                    <option value="Somerst">Somerset</option>
                    <option value="StoneBr">Stone Brook</option>
                    <option value="Timber">Timberland</option>
                    <option value="Veenker">Veenker</option>
                  </Form.Select>
                  <ValidationMessage message={getFieldError('Neighborhood')} />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Bathrooms <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="FullBath"
                    value={formData.FullBath}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="0"
                    max="5"
                    isInvalid={isFieldInvalid('FullBath')}
                    required
                  />
                  <ValidationMessage message={getFieldError('FullBath')} />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Half Bathrooms</Form.Label>
                  <Form.Control
                    type="number"
                    name="HalfBath"
                    value={formData.HalfBath}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="0"
                    max="3"
                    isInvalid={isFieldInvalid('HalfBath')}
                  />
                  <ValidationMessage message={getFieldError('HalfBath')} />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Rooms Above Grade <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="TotRmsAbvGrd"
                    value={formData.TotRmsAbvGrd}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="0"
                    max="20"
                    isInvalid={isFieldInvalid('TotRmsAbvGrd')}
                    required
                  />
                  <ValidationMessage message={getFieldError('TotRmsAbvGrd')} />
                </Form.Group>
              </Col>
            </Row>
          </FormSection>

          <div className="section-divider"></div>

          {/* Quality & Features */}
          <FormSection title="Quality Assessment">
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Kitchen Quality <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="KitchenQual"
                    value={formData.KitchenQual}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={isFieldInvalid('KitchenQual')}
                    required
                  >
                    <option value="Ex">Excellent</option>
                    <option value="Gd">Good</option>
                    <option value="TA">Typical/Average</option>
                    <option value="Fa">Fair</option>
                    <option value="Po">Poor</option>
                  </Form.Select>
                  <ValidationMessage message={getFieldError('KitchenQual')} />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Exterior Quality <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="ExterQual"
                    value={formData.ExterQual}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={isFieldInvalid('ExterQual')}
                    required
                  >
                    <option value="Ex">Excellent</option>
                    <option value="Gd">Good</option>
                    <option value="TA">Typical/Average</option>
                    <option value="Fa">Fair</option>
                    <option value="Po">Poor</option>
                  </Form.Select>
                  <ValidationMessage message={getFieldError('ExterQual')} />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Heating Quality</Form.Label>
                  <Form.Select
                    name="HeatingQC"
                    value={formData.HeatingQC}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={isFieldInvalid('HeatingQC')}
                  >
                    <option value="">Not specified</option>
                    <option value="Ex">Excellent</option>
                    <option value="Gd">Good</option>
                    <option value="TA">Typical/Average</option>
                    <option value="Fa">Fair</option>
                    <option value="Po">Poor</option>
                  </Form.Select>
                  <ValidationMessage message={getFieldError('HeatingQC')} />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Foundation Type <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="Foundation"
                    value={formData.Foundation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={isFieldInvalid('Foundation')}
                    required
                  >
                    <option value="PConc">Poured Concrete</option>
                    <option value="CBlock">Cinder Block</option>
                    <option value="BrkTil">Brick & Tile</option>
                    <option value="Slab">Slab</option>
                    <option value="Stone">Stone</option>
                    <option value="Wood">Wood</option>
                  </Form.Select>
                  <ValidationMessage message={getFieldError('Foundation')} />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Electrical System</Form.Label>
                  <Form.Select
                    name="Electrical"
                    value={formData.Electrical}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={isFieldInvalid('Electrical')}
                  >
                    <option value="">Not specified</option>
                    <option value="SBrkr">Standard Circuit Breakers</option>
                    <option value="FuseA">Fuse Box (60 AMP)</option>
                    <option value="FuseF">Fuse Box (60 AMP+)</option>
                    <option value="FuseP">Fuse Box (Poor)</option>
                    <option value="Mix">Mixed</option>
                  </Form.Select>
                  <ValidationMessage message={getFieldError('Electrical')} />
                </Form.Group>
              </Col>
            </Row>
          </FormSection>

          <div className="section-divider"></div>

          {/* Optional Features - Collapsible */}
          <Accordion defaultActiveKey="0" className="mb-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Garage Information</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Garage Cars</Form.Label>
                      <Form.Control
                        type="number"
                        name="GarageCars"
                        value={formData.GarageCars}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="0"
                        max="5"
                        placeholder="0"
                        isInvalid={isFieldInvalid('GarageCars')}
                      />
                      <ValidationMessage message={getFieldError('GarageCars')} />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Garage Area (sq ft)</Form.Label>
                      <Form.Control
                        type="number"
                        name="GarageArea"
                        value={formData.GarageArea}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="0"
                        placeholder="0"
                        isInvalid={isFieldInvalid('GarageArea')}
                      />
                      <ValidationMessage message={getFieldError('GarageArea')} />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Garage Year Built</Form.Label>
                      <Form.Control
                        type="number"
                        name="GarageYrBlt"
                        value={formData.GarageYrBlt}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Same as house"
                        isInvalid={isFieldInvalid('GarageYrBlt')}
                      />
                      <ValidationMessage message={getFieldError('GarageYrBlt')} />
                    </Form.Group>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>Additional Areas</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Second Floor Area (sq ft)</Form.Label>
                      <Form.Control
                        type="number"
                        name="SecondFlrSF"
                        value={formData.SecondFlrSF}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="0"
                        placeholder="0"
                        isInvalid={isFieldInvalid('SecondFlrSF')}
                      />
                      <ValidationMessage message={getFieldError('SecondFlrSF')} />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Total Basement Area (sq ft)</Form.Label>
                      <Form.Control
                        type="number"
                        name="TotalBsmtSF"
                        value={formData.TotalBsmtSF}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="0"
                        placeholder="0"
                        isInvalid={isFieldInvalid('TotalBsmtSF')}
                      />
                      <ValidationMessage message={getFieldError('TotalBsmtSF')} />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Masonry Veneer Area (sq ft)</Form.Label>
                      <Form.Control
                        type="number"
                        name="MasVnrArea"
                        value={formData.MasVnrArea}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="0"
                        placeholder="0"
                        isInvalid={isFieldInvalid('MasVnrArea')}
                      />
                      <ValidationMessage message={getFieldError('MasVnrArea')} />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Lot Frontage (linear ft)</Form.Label>
                      <Form.Control
                        type="number"
                        name="LotFrontage"
                        value={formData.LotFrontage}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="0"
                        placeholder="Optional"
                        isInvalid={isFieldInvalid('LotFrontage')}
                      />
                      <ValidationMessage message={getFieldError('LotFrontage')} />
                    </Form.Group>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>Other Features</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Year Remodeled</Form.Label>
                      <Form.Control
                        type="number"
                        name="YearRemodAdd"
                        value={formData.YearRemodAdd}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Same as built year"
                        isInvalid={isFieldInvalid('YearRemodAdd')}
                      />
                      <ValidationMessage message={getFieldError('YearRemodAdd')} />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Number of Fireplaces</Form.Label>
                      <Form.Control
                        type="number"
                        name="Fireplaces"
                        value={formData.Fireplaces}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="0"
                        max="5"
                        isInvalid={isFieldInvalid('Fireplaces')}
                      />
                      <ValidationMessage message={getFieldError('Fireplaces')} />
                    </Form.Group>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <div className="d-grid gap-2 mt-4">
            <Button 
              variant="primary" 
              type="submit" 
              size="lg"
              disabled={loading || Object.keys(validationErrors).length > 0}
              style={{ padding: '1rem 2rem', fontSize: '1.05rem' }}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Calculating Price...
                </>
              ) : (
                'Calculate Estimated Price'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default HousePredictionForm

