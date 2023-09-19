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
          min={0}
          onChange={e => setGoalSpeed(Number(e.target.value))}
        />
        <InputGroup.Text id="rider-power-unit">{unit === 'Metric'? 'kph' : 'mph'}</InputGroup.Text>
      </InputGroup>
    </Container> 
  )
}

export default SegmentGoalSpeed