import Container from "react-bootstrap/Container"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const SegmentGoalPower = ({ goalPower, setGoalPower }) => {
  return (
    <Container className='tile' fluid='md'>
      <InputGroup className="mb-3" >
        <Form.Control
          defaultValue={goalPower}
          aria-label="rider-goal-power"
          aria-describedby="rider-goal-power"
          type="number"
          onChange={e => setGoalPower(e.target.value * 1) }
        />
        <InputGroup.Text id="rider-power-unit">W</InputGroup.Text>
      </InputGroup>
    </Container> 
  )
}

export default SegmentGoalPower