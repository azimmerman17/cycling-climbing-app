import Container from "react-bootstrap/Container"
import { useState, useEffect } from "react";

import CalcPower from "../Functions/CalcPower"
import CalcSpeed from "../Functions/CalcSpeed"
import CalcTime from "../Functions/CalcTime"
import TimeConvSec from "../Functions/TimeConvSec"
import getTrainingZone from "../Functions/getTrainingZone";
import CalcTSS from "../Functions/CalcTSS";

// Plan on a ride either power, speed, or time goal
const SegmentPlan = ({ data, weight, goalTime, goalPower, goalSpeed, goalBenchmark, goalUnit, unit, FTP }) => {
  const { total_elevation_gain, distance, athlete_segment_stats, xoms } = data
  const { pr_elapsed_time } = athlete_segment_stats
  const { kom, overall, qom } = xoms

  let [ benchmarkTime, setBenchmarkTime ] = useState(pr_elapsed_time)

  useEffect (() => {
    const stringTimeToSeconds = (string) => {
      let array = string.split(':')
      if (array.length === 3) return (array[0] * 3600) + (array[1] * 60) + (Number(array[2]))
      else if (array.length === 2) return (array[0] * 60) + (Number(array[1]))
      else if (array.length === 1) return Number(array[0])
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

  let timeCalc
  let weightMetric
  if (unit === 'Metric') weightMetric = weight
  else weightMetric = weight * 0.453592 


  const returnData = (goalUnit) => {
    switch (goalUnit) {
      case 'Time':
        return (
          <div>
            <p>Power: {goalTime > 0 && weight > 0 ? <strong>{CalcPower(unit, weight, goalTime, total_elevation_gain)} W</strong> : `N/A`}</p>
            <p>Speed: {goalTime > 0 ? <strong>{CalcSpeed(unit, goalTime, distance)} {unit === 'Metric'? 'kph' : 'mph'}</strong>: `N/A`}</p>
            <p>W/Kg: {goalTime > 0 && weight > 0 ? <strong>{(CalcPower(unit, weight, goalTime, total_elevation_gain) / weightMetric).toFixed(2)} W/kg</strong> : `N/A`}</p>
            <p>Engery: { goalTime > 0 && weight > 0 ? <strong>{Math.floor(CalcPower(unit, weight, goalTime, total_elevation_gain) * 1.1 * goalTime / 1000)} KJ</strong> : `N/A`}</p>
            <p>Training Zone: {goalTime > 0 && weight > 0 && FTP > 0 ? <strong>{getTrainingZone(FTP, CalcPower(unit, weight, goalTime, total_elevation_gain))}</strong> : 'N/A'}</p>
            <p>TSS: {goalTime > 0 && weight > 0 && FTP > 0 ? <strong>{CalcTSS(goalTime, CalcPower(unit, weight, goalTime, total_elevation_gain), FTP)}</strong> : 'N/A'}</p>
            {/* ADD MESSAGE */}
          </div>
        )
      case 'Power':
        timeCalc = CalcTime(unit, weight, goalPower / 1.1, total_elevation_gain)
        return (
          <div>
            <p>Time: {goalPower > 0 && weight > 0 ? <strong>{TimeConvSec(timeCalc)}</strong> : 'N/A'}</p>
            <p>Speed: {goalPower > 0 && weight > 0 ? <strong>{CalcSpeed(unit, timeCalc, distance)} {unit === 'Metric'? 'kph' : 'mph'}</strong>: `N/A`}</p>
            <p>W/Kg: {goalPower > 0 && weight > 0 ? <strong>{(goalPower / weightMetric).toFixed(2)} W/kg</strong> : `N/A`}</p>
            <p>Engery: { goalPower > 0 && weight > 0 ? <strong>{Math.floor(goalPower * timeCalc / 1000)} KJ</strong> : `N/A`}</p>
            <p>Training Zone: {goalPower > 0 && weight > 0 && FTP > 0 ? <strong>{getTrainingZone(FTP, goalPower)}</strong> : 'N/A'}</p>
            <p>TSS: {goalPower > 0 && weight > 0 && FTP > 0 ? <strong>{CalcTSS(timeCalc, goalPower, FTP)}</strong> : 'N/A'}</p>
            {/* ADD MESSAGE */}
          </div>
        )
      case 'Speed':
        // convert speed to m/s
        if (unit !== 'metric') timeCalc = distance / (goalSpeed * 0.44704)
        else timeCalc = distance / (goalSpeed * 0.277778)
        return (
          <div>
            <p>Power: {goalSpeed > 0 && weight > 0 ? <strong>{CalcPower(unit, weight, timeCalc, total_elevation_gain)} W</strong> : `N/A`}</p>
            <p>Time: {goalSpeed > 0 ? <strong>{TimeConvSec(timeCalc)}</strong> : 'N/A'}</p>
            <p>W/Kg: {goalSpeed > 0 && weight > 0 ? <strong>{(CalcPower(unit, weight, timeCalc, total_elevation_gain) / weightMetric).toFixed(2)} W/kg</strong> : `N/A`}</p>
            <p>Engery: { goalSpeed > 0 && weight > 0 ? <strong>{Math.floor(CalcPower(unit, weight, timeCalc, total_elevation_gain) * 1.1 * timeCalc / 1000)} KJ</strong> : `N/A`}</p>
            <p>Training Zone: {goalSpeed > 0 && weight > 0 && FTP > 0 ? <strong>{getTrainingZone(FTP, CalcPower(unit, weight, timeCalc, total_elevation_gain))}</strong> : 'N/A'}</p>
            <p>TSS: {goalSpeed > 0 && weight > 0 && FTP > 0 ? <strong>{CalcTSS(timeCalc, CalcPower(unit, weight, timeCalc, total_elevation_gain), FTP)}</strong> : 'N/A'}</p>
            {/* ADD MESSAGE */}
          </div>
        )
      case 'Benchmark':
        return (
          <div>
            <p>Time: {benchmarkTime > 0 ? <strong>{TimeConvSec(benchmarkTime)}</strong> : 'N/A'}</p>
            <p>Power: {benchmarkTime > 0 && weight > 0 ? <strong>{CalcPower(unit, weight, benchmarkTime, total_elevation_gain)} W</strong> : `N/A`}</p>
            <p>Speed: {benchmarkTime > 0 ? <strong>{CalcSpeed(unit, benchmarkTime, distance)} {unit === 'Metric'? 'kph' : 'mph'}</strong>: `N/A`}</p>
            <p>W/Kg: {benchmarkTime > 0 && weight > 0 ? <strong>{(CalcPower(unit, weight, benchmarkTime, total_elevation_gain) / weightMetric).toFixed(2)} W/kg</strong> : `N/A`}</p>
            <p>Engery: { benchmarkTime > 0 && weight > 0 ? <strong>{Math.floor(CalcPower(unit, weight, benchmarkTime, total_elevation_gain) * benchmarkTime / 1000)} KJ</strong> : `N/A`}</p>
            <p>Training Zone: {benchmarkTime > 0 && weight > 0 && FTP > 0 ? <strong>{getTrainingZone(FTP, CalcPower(unit, weight, benchmarkTime, total_elevation_gain))}</strong> : 'N/A'}</p>
            <p>TSS: {benchmarkTime > 0 && weight > 0 && FTP > 0 ? <strong>{CalcTSS(benchmarkTime, CalcPower(unit, weight, benchmarkTime, total_elevation_gain), FTP)}</strong> : 'N/A'}</p>
            {/* ADD MESSAGE */}
          </div>
        )
    }
  }

  return (
    <Container className='tile' fluid='md'>
      <h6 className="fw-bold text-center mb-3">Estimates</h6>
      {returnData(goalUnit)}
      <p className="disclaimer">Power and Energy Calculations are for optimial conditions, do not take into account factors such as air resistance, weather, varying gradient, tire choice, etc. Actual output may vary</p>
      <p className="disclaimer">Estimates are more accurate with steeper uphill gradients, please be safe, ride within your limits, and don't do anything stupid.</p>
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
