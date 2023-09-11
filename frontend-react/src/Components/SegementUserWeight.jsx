import Container from "react-bootstrap/Container"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const SegmentUserWeight = ({ weight, setWeight, unit }) => {
  let localUnit
  if (unit = 'Imperial') localUnit = 'lb'
  else localUnit = 'kg'

  return (
    <Container className='tile' fluid='md'>
      <h6 htmlFor="rider-weight" className="form-label fw-bold text-center mb-3">Rider Weight</h6>
      <InputGroup className="mb-3" >
        <Form.Control
          defaultValue={weight}
          aria-label="rider-weight"
          aria-describedby="rider-weight"
          type="number"
          onChange={e => setWeight((e.target.value * 1)) }
        />
        <InputGroup.Text id="rider-weight-unit">{localUnit}</InputGroup.Text>
      </InputGroup>
      <p className="disclaimer">20lbs (9.05kg) has been automatically to account for the bike and gear weight.  If know your equipment will be a different weight please add/subtract it from your weight.</p>
    </Container> 
  )
}

export default SegmentUserWeight