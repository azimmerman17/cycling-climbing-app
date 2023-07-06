import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import RadioButtons from './RadioButtons'

const Segment_Title = ({ data, unit, setUnit }) => {
  const { average_grade, city, climb_category, country, distance, elevation_high, elevation_low,maximum_grade, name, state, total_elevation_gain, } = data
  
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
    <div>
      <h3>{name}</h3>

      <span>{city}, </span><span>{state} </span><span>{country}</span>
      {/* Radio to change units */}
      {/* <RadioButtons radioNme={unit} setRadioNme={setUnit} radios={units} /> */}
      <Container>
        <Row>
          <Col>
            <p>Distance</p>
            <h4>{unit === 'metric' ? `${distance_km} km` : `${distance_mi} mi`} </h4>
          </Col>
          <Col>
            <p>Avg Grade</p>
            <h4>{average_grade}%</h4>
          </Col>
          <Col>
            <p>Max Grade</p>
            <h4>{maximum_grade}%</h4>
          </Col>
          <Col>
            <p>Elevation Gain</p>
            <h4>{unit === 'metric' ? `${total_elevation_gain_m} m` : `${total_elevation_gain_ft} ft`} </h4>
          </Col>
          <Col>
            <p>Peak</p>
            <h4>{unit === 'metric' ? `${elevation_high_m} m` : `${elevation_high_ft} ft`} </h4>
          </Col>
          <Col>
            <p>Climb Cat.</p>
            <h4>{climb_category_value}</h4>
          </Col>
        </Row>
      </Container>
    </div>

  )
}

export default Segment_Title
