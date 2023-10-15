import { useEffect, useState } from "react";
import { redirect, useSearchParams } from "react-router-dom";
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import SegmentTitle from "./SegmentTitle";
import SegmentMap from "./SegementMap";
import GetDistanceFromLatLonInKm from "../Functions/GetDistanceFromLatLonInKm";

const SegmentRequest = () => {
  const [ searchParams, setSearchParams ] = useSearchParams();

  let [ id, setId ] = useState(searchParams.get("id"))
  let [ segmentData, setSegmentData ] = useState(null)
  let [ alert, setAlert ] = useState({msg: null, state: 2})
  
  useEffect(() => {
    const fetchSegment = async (id) => {
      const BASE_URL = 'http://localhost:8080/segments/'
      const url = BASE_URL + id
      const response = await fetch(url)     
      let data = await response.json()
      if (data.message) data = null
      setSegmentData(data)
      if (data) checkAlert(data)
      else setAlert({msg: null, state: 2})
    }

    const checkAlert = (data) => {
      const { activity_type, average_grade, hazardous, start_latlng, end_latlng, distance } = data
      let alertList = []
      if (activity_type === 'Run') alertList.push('Segment is not a cycling segment')
      if (data.private) alertList.push('Segment set to Private')
      if (average_grade < 0) alertList.push('Segment is downhill')
      if (hazardous) alertList.push('Segment is hazardous')
      let deltaLocation = GetDistanceFromLatLonInKm(start_latlng[0], start_latlng[1], end_latlng[0], end_latlng[1]) * 1000
    console.log(alertList)
    if (alertList.length > 0) {
      setAlert({
        msg: alertList.toString(),
        state: 2
      })
      console.log(alert)
    } else if (deltaLocation / distance < .05 ) {
      setAlert({
        msg: 'Segment may be a loop',
        state: 1
      })
    } else {
      setAlert({msg: null, state: 0})
    }
  }


    if (id) {
      setSegmentData(null)
      fetchSegment(id)
    }
    // if (segmentData) {
    //   checkAlert(segmentData)
    //   console.log(alert)
    // }
  }, [id])

  const getSegmentData = (data) => {
    if (data) {
      const { end_latlng, start_latlng, map } = data

      return (
        <Container className='tile main-height' fluid='md'>
          <SegmentTitle data={data} unit={'Imperial'} />
          <SegmentMap start={start_latlng} end={end_latlng} map={map} />
        </Container>
      )
    }
  }

  const handleSubmit = async (id) => {
    const BASE_URL = 'http://localhost:8080/segments/request/'
    const url = BASE_URL + id
    const response = await fetch(url)
    const data = await response.json()
    setAlert(data)
  }

  const showAlert = (alert) => {
    const { state, msg } = alert

    if (msg !== null) {
      let variant
      switch (state) {
        case 0:
          variant = 'success'
          break
        case 1:
          variant = 'warning'
          break
        default:
          variant = 'danger'
      }

      return <Alert variant={variant}>{msg}</Alert>
    }
  }

  console.log(alert)
  return (
    <Container className='tile main-height' fluid='md'>
      {showAlert(alert)}
      <h6 htmlFor="segment-request" className="form-label fw-bold text-center mb-3">Request new Segment</h6>
      <Row>
        <Col xs={4} className="p-3">
          <InputGroup className="mb-3" style={{minWidth: '330px'}}>
            <InputGroup.Text className='mx-0' id="segment-id">Segment Id</InputGroup.Text>
            <Form.Control
              defaultValue={id}
              aria-label="segment-id"
              aria-describedby="segment-id"
              type="number"
              onChange={e => setId(e.target.value)}
            />
            <Button className='' onClick={e => handleSubmit(id)} disabled={!segmentData || alert.state === 2}>
              Submit
            </Button>
          </InputGroup>
        </Col>
      </Row>
      <Row>
        {getSegmentData(segmentData)}
      </Row>
      <Row className='disclaimer m-2'>
        <p className='text-center'>All submitted requests will be reviewed.  Segments with the following will be added to the database:</p>
        <ul>
          <li>Downhill Segments</li>
          <li>Segments Marked as Hazardous</li>
          <li>Private Segments</li>
          <li>Running Segments</li>
          <li>Duplicate Segments</li>
          <li>Shortened Segments of Longer Hills</li>
        </ul>
      </Row>
    </Container>
  )
}

export default SegmentRequest

