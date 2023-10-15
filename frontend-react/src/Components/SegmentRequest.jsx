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

const SegmentRequest = () => {
  const [ searchParams, setSearchParams ] = useSearchParams();

  let [ id, setId ] = useState(searchParams.get("id"))
  let [ segmentData, setSegmentData ] = useState(null)
  let [ alert, setAlert ] = useState(null)
  
  useEffect(() => {
    const fetchSegment = async (id) => {
      const BASE_URL = 'http://localhost:8080/segments/'
      const url = BASE_URL + id
      const response = await fetch(url)     
      let data = await response.json()
      if (data.message) data = null
      setSegmentData(data)
    }

    if (id) {
      fetchSegment(id)
    }
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
    if (alert) {
      const { state, msg } = alert
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
            <Button className='' onClick={e => handleSubmit(id)} disabled={!segmentData}>
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

