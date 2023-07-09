import { useState } from "react"
import { useParams } from "react-router-dom"
import Container from "react-bootstrap/Container"

import StravaSample from '../flowingSprings'
import SegmentTitle from "./SegmentTitle"
import RadioButtons from "./RadioButtons"
import SegmentDetailView from "./SegmentDetailView"
import SegmentMap from "./SegementMap"

const Segments = () => {
  let { segmentId } = useParams()
  let [ radioNme, setRadioNme ] = useState('Details')
  let [ unit, setUnit ] = useState('Imperial')

  const { end_latlng, start_latlng, map } = StravaSample

  let segmentRadios = [
    'Details',
    'Training',
    'Plan',
    'Leaderboard'
  ]

  const view = (radioNme) => {
    switch (radioNme) {
      case 'Details':
        return <SegmentDetailView data={StravaSample} unit={unit} />
      case 'Training':
        return <div>Training</div>
      case 'Plan':
        return <div>Plan</div>
      case 'Leaderboard':
        return <div> Strava Leaderboard</div>
      default:
        return <div>Error View</div>
    }

  }

  // console.log(StravaSample)
 // console.log(radioNme)

  return (
    <div>
      <SegmentTitle data={StravaSample} unit={unit} setUnit={setUnit}/>
      <SegmentMap start={start_latlng} end={end_latlng} map={map} />
      {/* segment map and profile */}
      <Container className='my-2 p-2' fluid='md'>
        <RadioButtons radioNme={radioNme} setRadioNme={setRadioNme} radios={segmentRadios} />
      </Container>
      {/* Use Radios to change the view */}
      {view(radioNme)}
    </div>

  )
}

export default Segments