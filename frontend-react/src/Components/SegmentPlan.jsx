import Container from "react-bootstrap/Container"
import CalcPower from "../Functions/CalcPower"
import CalcSpeed from "../Functions/CalcSpeed"
import CalcTime from "../Functions/CalcTime"
import TimeConvSec from "../Functions/TimeConvSec"

// Plan on a ride either power, speed, or time goal
const SegmentPlan = ({ data, weight, goalTime, goalPower, goalSpeed, goalBenchmark, goalUnit, unit }) => {
  const { total_elevation_gain, distance } = data

  console.log(goalSpeed)

  
  const returnData = (goalUnit) => {
    switch (goalUnit) {
      case 'Time':
        return (
          <div>
            <p>Power: {goalTime > 0 && weight > 0 ? <strong>{CalcPower(unit, weight, goalTime, total_elevation_gain)} W</strong> : `N/A`}</p>
            <p>Speed: {goalTime > 0 && weight > 0 ? <strong>{CalcSpeed(unit, goalTime, distance)} {unit === 'Metric'? 'kph' : 'mph'}</strong>: `N/A`}</p>
          </div>
        )
      case 'Power':
        let timePower = CalcTime(unit, weight, goalPower, total_elevation_gain)
        return (
          <div>
            <p>Time: {goalPower > 0 && weight >0 ? <strong>{TimeConvSec(timePower)}</strong> : 'N/A'}</p>
            <p>Speed: {goalPower > 0 && weight > 0 ? <strong>{CalcSpeed(unit, timePower, distance)} {unit === 'Metric'? 'kph' : 'mph'}</strong>: `N/A`}</p>
          </div>
        )
      case 'Speed':
        // convert speed to m/s
        let timeSpeed
        if (unit !== 'metric') timeSpeed = distance / (goalSpeed * 0.44704)
        else timePower = distance / (goalSpeed * 0.277778)

        return (
          <div>
            <p>Power: {goalSpeed > 0 && weight > 0 ? <strong>{CalcPower(unit, weight, timeSpeed, total_elevation_gain)} W</strong> : `N/A`}</p>
            <p>Time: {goalSpeed > 0 && weight >0 ? <strong>{TimeConvSec(timeSpeed)}</strong> : 'N/A'}</p>
          </div>
        )
    
        // POWER + TIME
      case 'Benchmark':
        return <p>Benchmark</p>
    }
  }
  

  return (
    <Container className='tile' fluid='md'>
      <h6 className="fw-bold text-center mb-3">Estimates</h6>
      {returnData(goalUnit)}
    </Container>
  )
}

export default SegmentPlan

// need rider weight
// need gear weight
// Goal  - Time, Power, Speed
// Length
// Evelation Gain
// PR, CR, KOM, QOM
