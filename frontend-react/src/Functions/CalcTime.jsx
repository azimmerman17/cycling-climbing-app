import Container from "react-bootstrap/Container"

import TimeConvSec from '../Functions/TimeConvSec'

const CalculateTime = (power, weight, unit, total_elevation_gain) => {
  //  TIME FORUMLA !!!! 
  // t = 9.8067 * kg * m / W (+ 0% to 10%) Resistance
  
  if (unit !== 'Metric') weight = (weight * 0.453592)
  weight += 9.07185

  let time = 9.8097 * weight * total_elevation_gain / power
  let timePlus10 = time * 1.1  // Additional 10% of time added due to lost engery from air and rolling resistance

  time = TimeConvSec(time)
  timePlus10 = TimeConvSec(time)

  return (
    <Container className='tile' fluid='md'>
      <h6>Estimated Time</h6>
      <h6>{time} - {timePlus10}</h6>
    </Container>
  )
}

export default ClimbPlan