import Container from "react-bootstrap/Container"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const SegmentGoalSpeed = ({ goalSpeed, setGoalSpeed, unit }) => {
  return (
    <Container className='tile' fluid='md'>
      <InputGroup className="mb-3" >
        <Form.Control
          defaultValue={goalSpeed}
          aria-label="rider-goal-power"
          aria-describedby="rider-goal-power"
          type="number"
          onChange={e => setGoalSpeed(e.target.value * 1) }
        />
        <InputGroup.Text id="rider-power-unit">{unit === 'Metric'? 'kph' : 'mph'}</InputGroup.Text>
      </InputGroup>
    </Container> 
  )
}

export default SegmentGoalSpeed