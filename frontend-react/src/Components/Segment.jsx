import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"

import SegmentTitle from "./SegmentTitle"
import RadioButtons from "./RadioButtons"
import SegmentDetailView from "./SegmentDetailView"
import SegmentMap from "./SegementMap"
import SegmentPlan from "./SegmentPlan"
import SegmentUserWeight from "./SegementUserWeight"
import SegmentPlanGoal from "./SegmentPlanGoal"
import Col from "react-bootstrap/esm/Col"
// import SegmentProfile from "./SegmentProfile"  // Later Build

const Segments = () => {
  let { segmentId } = useParams()
  let [ segmentData, SetSegmentData ] = useState(null)
  let [ radioNme, setRadioNme ] = useState('Details')
  let [ unit, setUnit ] = useState('Imperial')
  let [ weight, setWeight] = useState(0)

  // For Plan Tab
  let [ goalTime, setGoalTime ] = useState(0)
  let [ goalPower, setGoalPower ] = useState(0)
  let [ goalSpeed, setGoalSpeed ] = useState(0)
  let [ goalBenchmark, setgoalBenchmark ] = useState('PR')
  let [ goalUnit, setGoalUnit ] = useState('Time')
  console.log(goalPower)


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
   // 'Leaderboard',  // possibly later, need to think about it
  ]

  const view = (radioNme) => {
    switch (radioNme) {
      case 'Details':
        return <SegmentDetailView data={segmentData} unit={unit} />
      case 'Training':
        return (
          <Container>
            <Row>
              <SegmentUserWeight weight={weight} setWeight={setWeight} />  
              {/* User FTP */}
              {/* USer Training Zones */}
            </Row>
          </Container>
        )

      case 'Plan':
        return (
          <Container>
            <Row>
              <Col xs={12} md={6}>
                <SegmentUserWeight weight={weight} setWeight={setWeight} />  
              </Col>
              <Col xs={12} md={6}>
                <SegmentPlanGoal goalTime={goalTime} setGoalTime={setGoalTime} goalPower={goalPower} setGoalPower={setGoalPower}  goalSpeed={goalSpeed} setGoalSpeed={setGoalSpeed} goalBenchmark={goalBenchmark} setgoalBenchmark={setgoalBenchmark} goalUnit={goalUnit} setGoalUnit={setGoalUnit} />
              </Col>
            </Row>
            <SegmentPlan data={segmentData} weight={weight} goalTime={goalTime} goalPower={goalPower} goalSpeed={goalSpeed} goalBenchmark={goalBenchmark} goalUnit={goalUnit} unit={unit} />
          </Container>
        )
      case 'Leaderboard':
        return <div> Strava Leaderboard</div>
      default:
        return <div>Error View</div>
    }

  }

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