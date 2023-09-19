import Container from "react-bootstrap/Container"
import Dropdown from 'react-bootstrap/Dropdown';

const SegmentTrainingZones = ({ trainingZone, setTrainingZone, FTP, rangeLow, setRangeLow, rangeHigh, setRangeHigh }) => {

  const displayZone = (zone) => {
    switch (zone) {
      case 1:
        setRangeLow(.01)
        setRangeHigh(.55)
        return 'Zone 1: Active Recovery'
      case 2: 
        setRangeLow(.55)
        setRangeHigh(.75)
        return 'Zone 2: Endurance'
      case 3: 
        setRangeLow(.75)
        setRangeHigh(.90)
        return 'Zone 3: Tempo'
      case 3.5:
        setRangeLow(.83)
        setRangeHigh(.97)
        return 'Sweet Spot'
      case 4:
        setRangeLow(.90)
        setRangeHigh(1.05)
        return 'Zone 4: Lactate Threshold'
      case 5:
        setRangeLow(1.05)
        setRangeHigh(1.20)
        return 'Zone 5: VO2 Max'
      case 6:
        setRangeLow(1.20)
        setRangeHigh(1.50)
        return 'Zone 6: Anaerobic Capacity'
      case 7:
        setRangeLow(1.50)
        setRangeHigh('∞')
        return 'Zone 7: Neuromuscular Power'
    }
  }
  
  return (
    <Container className='tile' fluid='md'>
      <h6 htmlFor="rider-interval" className="form-label fw-bold text-center mb-3">Training Zone</h6>
      <Dropdown className='mb-3'>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {displayZone(trainingZone)}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={e => setTrainingZone(1)}>Zone 1: Active Recovery</Dropdown.Item>
          <Dropdown.Item onClick={e => setTrainingZone(2)}>Zone 2: Endurance</Dropdown.Item>
          <Dropdown.Item onClick={e => setTrainingZone(3)}>Zone 3: Tempo</Dropdown.Item>
          <Dropdown.Item onClick={e => setTrainingZone(3.5)}>Sweet Spot</Dropdown.Item>
          <Dropdown.Item onClick={e => setTrainingZone(4)}>Zone 4: Lactate Threshold</Dropdown.Item>
          <Dropdown.Item onClick={e => setTrainingZone(5)}>Zone 5: VO2 Max</Dropdown.Item>
          <Dropdown.Item onClick={e => setTrainingZone(6)}>Zone 6: Anaerobic Capacity</Dropdown.Item>
          <Dropdown.Item onClick={e => setTrainingZone(7)}>Zone 7: Neuromuscular Power </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <p>Target Power Range (W): {(FTP * rangeLow).toFixed(0)} ({(rangeLow * 100).toFixed(0)}%) - {rangeHigh === '∞' ? '∞' : `${(FTP * rangeHigh).toFixed(0)} (${(100 * rangeHigh).toFixed(0)}%)`}</p>
    </Container>
  )
}

export default SegmentTrainingZones