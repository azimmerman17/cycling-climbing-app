import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import SegmentTitle from "./SegmentTitle"
import RadioButtons from "./RadioButtons"
import SegmentDetailView from "./SegmentDetailView"
import SegmentMap from "./SegementMap"
import SegmentPlan from "./SegmentPlan"
import SegmentUserWeight from "./SegementUserWeight"
import SegmentPlanGoal from "./SegmentPlanGoal"
import SegmentTrainingView from "./SegmentTrainingView"
import SegmentUserFTP from "./SegmentUserFTP"
import SegmentTrainingInverval from "./SegmentTrainingInterval"
import SegmentTrainingZones from "./SegmentTrainingZones"
// import SegmentProfile from "./SegmentProfile"  // Later Build

import { CurrentUser } from "../Context/CurrentUser"

const Segments = () => {
  let { segmentId } = useParams()
  const { currentUser } = useContext(CurrentUser)

  let [ segmentData, SetSegmentData ] = useState(null)
  let [ radioNme, setRadioNme ] = useState('Details')
  let [ unit, setUnit ] = useState('Imperial')
  let [ weight, setWeight] = useState(0)

  // For Training Tab
  let [ FTP, setFTP ] = useState(0)
  let [ interval, setInterval ] = useState(0)
  let [ trainingZone, setTrainingZone ] = useState(2)
  let [ rangeLow, setRangeLow ] = useState(0)
  let [ rangeHigh, setRangeHigh ] = useState(1)

  // For Plan Tab
  let [ goalTime, setGoalTime ] = useState(0)
  let [ goalPower, setGoalPower ] = useState(0)
  let [ goalSpeed, setGoalSpeed ] = useState(0)
  let [ goalBenchmark, setGoalBenchmark ] = useState('PR')
  let [ goalUnit, setGoalUnit ] = useState('Time')

  useEffect (() => {
    const fetchSegment = async (id) => {
      const BASE_URL = 'http://localhost:8080/segments/'
      const url = BASE_URL + id
      const response = await fetch(url)     
      const data = await response.json()
      SetSegmentData(data)
    }
    const setUserData = (user) => {
      if (user.ftp) setFTP(user.ftp)
      if (user.perfer_unit) setUnit(user.perfer_unit)
      if (user.weight) {
        if (unit === 'Imperial') setWeight((user.weight * 2.21).toFixed(1))
        else setWeight(user.weight)
      }
    }
    if (segmentId) {
      fetchSegment(segmentId)
    }
    if (currentUser) {
      setUserData(currentUser)
    }
  }, [segmentId, currentUser])

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
              <Col xs={12} md={6}>
                <SegmentUserWeight weight={weight} setWeight={setWeight} />  
              </Col>
              <Col xs={12} md={6}>
                <SegmentTrainingZones trainingZone={trainingZone} setTrainingZone={setTrainingZone} FTP={FTP} rangeLow={rangeLow} setRangeLow={setRangeLow} rangeHigh={rangeHigh} setRangeHigh={setRangeHigh} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <SegmentTrainingInverval interval={interval} setInterval={setInterval} />
              </Col>
              <Col xs={12} md={6}>
                <SegmentUserFTP FTP={FTP} setFTP={setFTP} /> 
              </Col>
            </Row>
            <Row>
              <SegmentTrainingView  FTP={FTP} interval={interval} trainingZone={trainingZone} weight={weight} rangeLow={rangeLow} rangeHigh={rangeHigh} unit={unit} segmentData={segmentData} />
            </Row>
          </Container>
        )

      case 'Plan':
        return (
          <Container>
            <Row>
              <Col xs={12} md={4}>
                <SegmentUserWeight weight={weight} setWeight={setWeight} />  
              </Col>
              <Col xs={12} md={4}>
                <SegmentUserFTP FTP={FTP} setFTP={setFTP} /> 
              </Col>
              <Col xs={12} md={4}>
                <SegmentPlanGoal goalTime={goalTime} setGoalTime={setGoalTime} goalPower={goalPower} setGoalPower={setGoalPower}  goalSpeed={goalSpeed} setGoalSpeed={setGoalSpeed} goalBenchmark={goalBenchmark} setGoalBenchmark={setGoalBenchmark} goalUnit={goalUnit} setGoalUnit={setGoalUnit} unit={unit} />
              </Col>
            </Row>
            <SegmentPlan data={segmentData} weight={weight} goalTime={goalTime} goalPower={goalPower} goalSpeed={goalSpeed} goalBenchmark={goalBenchmark} goalUnit={goalUnit} unit={unit} FTP={FTP} />
          </Container>
        )
      case 'Leaderboard':
        return <div> Strava Leaderboard</div>
      default:
        return <div>Error View</div>
    }

  }

  if (segmentData) {
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