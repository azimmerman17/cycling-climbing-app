import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import RadioButtons from './RadioButtons'

const SegmentTitle = ({ data, unit, setUnit }) => {
  const { average_grade, climb_category, distance, elevation_high, maximum_grade, name, total_elevation_gain, } = data
  
  const units = [
    'Imperial',
    'Metric'
  ]
  // calculations to ajust varibles to appropriate units (2 decimal places)
  // distance to miles -- delivered unit: m
  let distance_mi = (distance / 1609.344).toFixed(2)
  // distance to km -- delivered unit: m
  let distance_km = (distance / 1000).toFixed(2)

  // elevations to ft -- delivered unit: m (0 decimal places)
  let total_elevation_gain_ft = (total_elevation_gain * 3.2808398950134).toFixed(0)
  let elevation_high_ft = (elevation_high * 3.2808398950134).toFixed(0)
  // elevations to m -- delivered unit: m
  let total_elevation_gain_m = total_elevation_gain.toFixed(0)
  let elevation_high_m = elevation_high.toFixed(0)
  // caluclations to adjust the climb catagory
  let climb_category_value
  if (climb_category === 5) climb_category_value = 'HC'
  else if (climb_category > 0 ) climb_category_value = 5 - climb_category
  else climb_category_value = 'NC'
  // Final adjustment for climbs with average grade under 3%
  if (average_grade < 3.0) climb_category_value = 'NC'
  

  return (
    <Container className='tile' fluid='md'>
      <h2 className='text-center'>{name}</h2>
      {/* Radio to change units */}
      {/* <RadioButtons radioNme={unit} setRadioNme={setUnit} radios={units} /> */}
      <Row>
        <Col xs={4} lg={2}>
          <p className='text-center font-small'>Distance</p>
          <h5 className='text-center'>{unit === 'metric' ? `${distance_km} km` : `${distance_mi} mi`} </h5>
        </Col>
        <Col xs={4} lg={2}>
          <p className='text-center font-small'>Avg Grade</p>
          <h5 className='text-center'>{average_grade}%</h5>
        </Col>
        <Col xs={4} lg={2}>
          <p className='text-center font-small'>Max Grade</p>
          <h5 className='text-center'>{maximum_grade}%</h5>
        </Col>
        <Col xs={4} lg={2}>
          <p className='text-center font-small'>Elevation Gain</p>
          <h5 className='text-center'>{unit === 'metric' ? `${total_elevation_gain_m} m` : `${total_elevation_gain_ft} ft`} </h5>
        </Col>
        <Col xs={4} lg={2}>
          <p className='text-center font-small'>Peak</p>
          <h5 className='text-center'>{unit === 'metric' ? `${elevation_high_m} m` : `${elevation_high_ft} ft`} </h5>
        </Col>
        <Col xs={4} lg={2}>
          <p className='text-center font-small'>Climb Cat.</p>
          <h5 className='text-center' >{climb_category_value}</h5>
        </Col>
      </Row>
    </Container>
  )
}

export default SegmentTitle
