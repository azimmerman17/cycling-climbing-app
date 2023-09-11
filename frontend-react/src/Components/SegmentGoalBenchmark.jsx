import Container from "react-bootstrap/Container"
import Dropdown from 'react-bootstrap/Dropdown';

const SegmentGoalBenchmark = ({ goalBenchmark, setGoalBenchmark }) => {
  return (
    <Container fluid='md'>
      <Dropdown className='mb-3'>
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          {goalBenchmark}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={e => setGoalBenchmark('PR')}>PR</Dropdown.Item>
          <Dropdown.Item onClick={e => setGoalBenchmark('KOM')}>KOM</Dropdown.Item>
          <Dropdown.Item onClick={e => setGoalBenchmark('QOM')}>QOM</Dropdown.Item>
          <Dropdown.Item onClick={e => setGoalBenchmark('CR')}>CR</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Container>
  )
}

export default SegmentGoalBenchmark