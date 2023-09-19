import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useState } from "react";

const SegmentTrainingInverval = ({ interval, setInterval }) => {
  let [ hour, setHour ] = useState(Math.floor(interval / 3660) || 0)
  let [ minute, setMinute ] = useState(Math.floor(interval % 3660 / 60) || 0)
  let [ second, setSecond ] = useState(Math.floor(interval % 3660 % 60) || 0)

  const setTime = (change, h, m, s) => {
    switch (change) {
      case 'hour':
        setHour(h)
        break
      case 'minute':
        setMinute(m)
        break
      default:
        setSecond(s)
        break
    }
    setInterval((h * 3600) + (m * 60) + (Number(s)))
  }

 return (
  <Container className='tile' fluid='md'>
    <h6 htmlFor="rider-interval" className="form-label fw-bold text-center mb-3">Interval</h6>
    <Row>
      <Col xs={4}>
        <InputGroup className="mb-3" >
          <Form.Control
            defaultValue={hour}
            aria-label="goal-hour"
            aria-describedby="goal-hour"
            type="number"
            min={0}
            onChange={e => setTime('hour', e.target.value, minute, second)}
          />
          <InputGroup.Text className='mx-0' id="goal-minute">h</InputGroup.Text>
        </InputGroup>
      </Col>
      <Col xs={4}>
        <InputGroup className="mb-3" >
          <Form.Control
            defaultValue={0}
            aria-label="goal-minute"
            aria-describedby="goal-minute"
            type="number"
            min={0}
            onChange={e => setTime('minute', hour, e.target.value, second)}
          />
          <InputGroup.Text id="goal-second">m</InputGroup.Text>
        </InputGroup>
      </Col>
      <Col xs={4}>
        <InputGroup className="mb-3" >
          <Form.Control
            defaultValue={0}
            aria-label="goal-second"
            aria-describedby="goal-second"
            type="number"
            min={0}
            onChange={e => setTime('minute', hour, minute, e.target.value)}
          />
          <InputGroup.Text id="goal-hour">s</InputGroup.Text>
        </InputGroup>
      </Col>
    </Row>
  </Container>
 )
}

export default SegmentTrainingInverval