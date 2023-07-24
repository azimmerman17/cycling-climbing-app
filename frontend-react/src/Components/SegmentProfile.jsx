import Container from 'react-bootstrap/Container'
import polyline from '@mapbox/polyline'
import { Line } from 'react-chartjs-2';

// Build Out Later, data may be more effective with a GPX file

import GetProfileElevationData from '../Functions/Get ProfileElevationData'

const SegmentProfile = ({ map }) => {
  const stravaPolyline = map.polyline
  let polyline_distance = 0
  let route = polyline.decode(stravaPolyline)
  
  let polyline_route = GetProfileElevationData(route)

  console.log(polyline_route)
  
  return (
    <Container fluid='xs'>
      Climb Profile
    </Container>
  )
}

export default SegmentProfile