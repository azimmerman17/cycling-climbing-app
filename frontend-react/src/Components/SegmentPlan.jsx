import Container from "react-bootstrap/Container"
import { useState, useEffect } from "react";

import CalcPower from "../Functions/CalcPower"
import CalcSpeed from "../Functions/CalcSpeed"
import CalcTime from "../Functions/CalcTime"
import TimeConvSec from "../Functions/TimeConvSec"

// Plan on a ride either power, speed, or time goal
const SegmentPlan = ({ data, weight, goalTime, goalPower, goalSpeed, goalBenchmark, goalUnit, unit }) => {
  const { total_elevation_gain, distance, athlete_segment_stats, xoms } = data
  const { pr_elapsed_time } = athlete_segment_stats
  const { kom, overall, qom } = xoms

  let [ benchmarkTime, setBenchmarkTime ] = useState(pr_elapsed_time)

  useEffect (() => {
    const stringTimeToSeconds = (string) => {
      let array = string.split(':')
      if (array.length === 3) return (array[0] * 3600) + (array[1] * 60) + (array[2] * 1)
      else if (array.length === 2) return (array[0] * 60) + (array[1] * 1)
      else if (array.length === 1) return (array[0] * 1)
      else {
        console.log('Error: Invalid Time')
        return 0
      }
    }

    if (goalBenchmark === 'PR') setBenchmarkTime(pr_elapsed_time)
    else if (goalBenchmark === 'KOM') setBenchmarkTime(stringTimeToSeconds(kom))
    else if (goalBenchmark === 'QOM') setBenchmarkTime(stringTimeToSeconds(qom))
    else if (goalBenchmark === 'CR') setBenchmarkTime(stringTimeToSeconds(overall))
  }, [goalBenchmark])

  const returnData = (goalUnit) => {
    switch (goalUnit) {
      case 'Time':
        return (
          <div>
            <p>Power: {goalTime > 0 && weight > 0 ? <strong>{CalcPower(unit, weight, goalTime, total_elevation_gain)} W</strong> : `N/A`}</p>
            <p>Speed: {goalTime > 0 ? <strong>{CalcSpeed(unit, goalTime, distance)} {unit === 'Metric'? 'kph' : 'mph'}</strong>: `N/A`}</p>
          </div>
        )
      case 'Power':
        let timePower = CalcTime(unit, weight, goalPower, total_elevation_gain)
        return (
          <div>
            <p>Time: {goalPower > 0 && weight > 0 ? <strong>{TimeConvSec(timePower)}</strong> : 'N/A'}</p>
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
            <p>Time: {goalSpeed > 0 ? <strong>{TimeConvSec(timeSpeed)}</strong> : 'N/A'}</p>
          </div>
        )
      case 'Benchmark':
        return (
          <div>
            <p>Time: {benchmarkTime > 0 ? <strong>{TimeConvSec(benchmarkTime)}</strong> : 'N/A'}</p>
            <p>Power: {benchmarkTime > 0 && weight > 0 ? <strong>{CalcPower(unit, weight, benchmarkTime, total_elevation_gain)} W</strong> : `N/A`}</p>
            <p>Speed: {benchmarkTime > 0 ? <strong>{CalcSpeed(unit, benchmarkTime, distance)} {unit === 'Metric'? 'kph' : 'mph'}</strong>: `N/A`}</p>

          </div>

        )
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
