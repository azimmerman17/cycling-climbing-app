import Container from "react-bootstrap/Container"

import CalcTime from "../Functions/CalcTime"
import CalcSpeed from "../Functions/CalcSpeed"
import TimeConvSec from "../Functions/TimeConvSec"
import CalcTSS from "../Functions/CalcTSS"
import CalcPower from "../Functions/CalcPower"

const SegmentTrainingView = ({ FTP, interval, trainingZone, weight, rangeLow, rangeHigh, unit, segmentData }) => {
  const { total_elevation_gain, distance } = segmentData
  // convert weight to metric if needed
  let weightMetric
  if (unit === 'Metric') weightMetric = weight
  else weightMetric = weight * 0.453592 

  // time range for training zone
  let timeLow
  let timeHigh

  // find min and max engery
  let minKJ
  let maxKJ

  if (FTP > 0 && weight > 0) {
    // weight added for bike + supplies
    // power decreased for external resistance (air, rolling, etc)
    timeLow = CalcTime(unit, weight + 9.07185, (FTP * rangeHigh / 1.1), total_elevation_gain) 
    timeHigh = CalcTime(unit, weight + 9.07185, (FTP * rangeLow / 1.1), total_elevation_gain)
    
    // For loop starts at lowest power in zone and ends at highest power in zone
    for (let i = Number((FTP * rangeLow).toFixed(0)); i < Number((FTP * rangeHigh).toFixed(0)) + 1; i++) {
      let energy = Math.floor(i * CalcTime(unit, weight + 9.07185, i / 1.1, total_elevation_gain) / 1000)
      if (!minKJ || energy < minKJ) minKJ = energy
      if (!maxKJ || energy > maxKJ) maxKJ = energy
    }
  } 

  // create messege
  let messege 
  let color
  const maxPower = CalcPower(unit, weight, interval, total_elevation_gain)
  if (timeLow && timeHigh) {
    if (timeLow > interval) {
      messege = 'This segment will work for this interval'
      color = '#198754'
    } 
    else if (timeLow < interval && timeHigh > interval) {
      messege = `This segment is suitable for this interval.\nThis interval will be too short if your power exceeds ${maxPower} W`
      color = '#FC6A03'
    }
    else if (timeHigh < interval) {
      messege = `This segment is not suitable for this interval.\nFor this interval, your power can not exceed ${maxPower}.\nFor this training zone, your interval can not exceed ${Math.floor(timeHigh / 60)} minutes.`
      color = '#FF2400'
    }
  }

  return (
    <Container className='tile' fluid='md'>
      <h6 className="form-label fw-bold text-center mb-3">Interval Estimates</h6>
      <p>Time: {timeLow && timeHigh ? <strong>{TimeConvSec(timeLow)} - {TimeConvSec(timeHigh)}</strong> : 'N/A'}</p>
      <p>Speed: {timeLow && timeHigh ? <strong>{CalcSpeed(unit, timeHigh, distance)} - {CalcSpeed(unit, timeLow, distance)} {unit === 'Metric'? 'kph' : 'mph'}</strong>: `N/A`}</p>
      <p>W/Kg: {timeLow && timeHigh && weight > 0 ? <strong>{((FTP * rangeLow) / weightMetric).toFixed(2)} - {((FTP * rangeHigh) / weightMetric).toFixed(2)} W/kg</strong> : `N/A`}</p>
      <p>Engery: {timeLow && timeHigh && weight > 0 ?
        <strong>{minKJ === maxKJ ? `${minKJ} KJ` : `${minKJ} - ${maxKJ} KJ`}</strong> : `N/A`}</p>
      <p>TSS: {timeLow && timeHigh && weight > 0 && FTP > 0 ? <strong>{CalcTSS(timeLow, (FTP * rangeLow), FTP)} - {CalcTSS(timeHigh, (FTP * rangeHigh), FTP)}</strong> : 'N/A'}</p>
      <p>{timeLow && timeHigh && interval > 0 ? <strong style={{'color':`${color}`, 'whiteSpace':'pre-wrap'}}>{messege}</strong> : null}</p>

    </Container>
  )
} 
export default SegmentTrainingView
