import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const SegmentStats = ({ data, unit }) => {
  const { average_grade, athlete_count, city, country, effort_count, elevation_high, elevation_low, hazardous, start_latlng, state } =data

  //add logic for unit conversions
  // Elevation Conversion to feet -- delivered unit: m
  let elevation_high_ft = (elevation_high * 3.2808398950134).toFixed(0)
  let elevation_low_ft = (elevation_low * 3.2808398950134).toFixed(0)

  // Elevation Conversion to meters -- delivered unit: m
  let elevation_high_m = elevation_high.toFixed(0)
  let elevation_low_m = elevation_low.toFixed(0)

  const calc_elevation = (high, low) => {
    if (average_grade > 0) return high - low
    return low - high
  }

  return (
  <Container className='tile' fluid='md'>
    <h4 className='text-center m-1'>Segment Details</h4>
    {hazardous ? <strong> Caution! This segment has been marked as hazardous!</strong>: null}
    <Row className='m-1'>
      <Col xs={3}>
        <h6 className='fw-bold font-small mb-0'>Start Location:</h6>
      </Col>
      <Col>
        <p className='font-small align-middle mb-0 link'>
          <a href={`https://www.google.com/maps/place/${start_latlng}`} target='_blank' className='font-small align-middle'>
            {country === 'United States' ? `${city}, ${state}` : `${city}, ${state ? state : null}, ${country}`}
          </a>
        </p>
      </Col>
    </Row>
    <Row className='m-1'>
      <Col xs={3}>
        <h6 className='fw-bold font-small align-middle mb-0'>Peak Elevation:</h6>
      </Col>
      <Col >
        <p className='font-small align-middle mb-0'>
          {unit = 'Imperial' ? `${elevation_high_ft} ft` : `${elevation_high_m} m`}
        </p>
      </Col>
    </Row>
    <Row className='m-1'>
      <Col xs={3}>
        <h6 className='fw-bold font-small mb-0'>Lowest Elevation:</h6>
      </Col>
      <Col>
      <p className='font-small align-middle mb-0'>
        {unit = 'Imperial' ? `${elevation_low_ft} ft` : `${elevation_low_m} m`}
      </p>
      </Col>
    </Row>
    <Row className='m-1'>
      <Col xs={3}>
        <h6 className='fw-bold font-small mb-0'>Δ Elevation:</h6>
      </Col>
      <Col>
      <p className='font-small align-middle mb-0'>
        {unit = 'Imperial' ? `${calc_elevation(elevation_high_ft, elevation_low_ft)} ft` : `${calc_elevation(elevation_high_m, elevation_low_m)} m`}
      </p>
      </Col>
    </Row>
    <Row className='m-1'>
      <Col xs={3}>
        <h6 className='fw-bold font-small mb-0'>Athlete Count:</h6>
      </Col>
      <Col>
      <p className='font-small align-middle mb-0'>{athlete_count}</p>
      </Col>
    </Row>
    <Row className='m-1'>
      <Col xs={3}>
        <h6 className='fw-bold font-small mb-0'>Total Efforts:</h6>
      </Col>
      <Col className='font-small align-middle mb-0'>
      <p className='font-small align-middle mb-0'>{effort_count}</p>
      </Col>
    </Row>
  </Container>
  )
}

export default SegmentStats