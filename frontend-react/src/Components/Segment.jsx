import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Container from "react-bootstrap/Container"

import StravaSample from '../flowingSprings'
import SegmentTitle from "./SegmentTitle"
import RadioButtons from "./RadioButtons"
import SegmentDetailView from "./SegmentDetailView"
import SegmentMap from "./SegementMap"
// import SegmentProfile from "./SegmentProfile"  // Later Build

const Segments = () => {
  let { segmentId } = useParams()
  let [ radioNme, setRadioNme ] = useState('Details')
  let [ unit, setUnit ] = useState('Imperial')
  let [ segmentData, SetSegmentData ] = useState(null)

  useEffect (() => {
    const fetchSegment = async (id) => {
      const BASE_URL = 'http://localhost:8080/segments/'
      const url = BASE_URL + id
      const response = await fetch(url)     
      const data = await response.json()
      SetSegmentData(data)
    }

    if (segmentId) {
      fetchSegment(segmentId)
    }
  }, [segmentId])



  let segmentRadios = [
    'Details',
    'Training',
    'Plan',
   // 'Leaderboard',  // possibly later, need to think about due to 
  ]

  const view = (radioNme) => {
    switch (radioNme) {
      case 'Details':
        return <SegmentDetailView data={segmentData} unit={unit} />
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
  if (segmentData) {
    console.log(segmentData)
    const { end_latlng, start_latlng, map } = segmentData

    return (
      <div>
        <SegmentTitle data={segmentData} unit={unit} setUnit={setUnit}/>
        <SegmentMap start={start_latlng} end={end_latlng} map={map} />
        {/* <SegmentProfile map={map} /> */}
        <Container className='my-2 p-2' fluid='md'>
          <RadioButtons radioNme={radioNme} setRadioNme={setRadioNme} radios={segmentRadios} />
        </Container>
        {/* Use Radios to change the view */}
        {view(radioNme)}
      </div>
    )
  }
}

export default Segments