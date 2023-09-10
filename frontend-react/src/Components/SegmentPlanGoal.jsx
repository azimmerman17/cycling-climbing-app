import Container from "react-bootstrap/Container"
import Dropdown from 'react-bootstrap/Dropdown';

import SegmentGoalTime from "./SegmentGoalTime";

const SegmentPlanGoal = ({ goalTime, setGoalTime, goalPower, setgoalPower,  goalSpeed, setGoalSpeed, goalBenchmark, setgoalBenchmark, goalUnit, setGoalUnit }) => {

  const goalInput = (unit) => {
    switch (unit) {
      case 'Time':
        return(
          <SegmentGoalTime goalTime={goalTime} setGoalTime={setGoalTime} />
        )
        break
      case 'Power':
        break
      case 'Speed':
        break
      case 'Benchmark':
        break
      default:
        console.log('Error: Goal Unit is not supported')
    }
  }
  return (
    <Container className='tile' fluid='md'>
      <h6 htmlFor="rider-goal-unit" className="form-label fw-bold text-center mb-3">Rider Goal</h6>
      <Dropdown className='mb-3'>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {goalUnit}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={e => setGoalUnit('Time')}>Time</Dropdown.Item>
          <Dropdown.Item onClick={e => setGoalUnit('Power')}>Power</Dropdown.Item>
          <Dropdown.Item onClick={e => setGoalUnit('Speed')}>Speed</Dropdown.Item>
          <Dropdown.Item onClick={e => setGoalUnit('Benchmark')}>Benchmark</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {goalInput(goalUnit)}
    </Container>
  )
}

export default SegmentPlanGoal