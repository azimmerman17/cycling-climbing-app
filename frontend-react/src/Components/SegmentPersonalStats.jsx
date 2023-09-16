import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import {AiFillStar} from 'react-icons/ai'

import TimeConvSec from '../Functions/TimeConvSec'
import DateConv from '../Functions/DateConv'

const SegmentPersonalStats = ({ data, starred }) => {
  const { effort_count, pr_activity_id, pr_date, pr_elapsed_time } = data

  const timeSince = (date) => {
    let today = new Date()
    let datePr = new Date(date)

    return Math.floor((today - datePr) / (1000 * 3600 * 24))   //milliseconds in a Day (1000msec = 1sec, 3600sec = 1hr, 24hr = 1 day)
  }

  return (
    <Container className='tile' fluid='md' >
       <h4 className='text-center m-2'>
        {starred ?<AiFillStar className='starred m-1'/> : ''}
        Personal Stats
        {starred ?<AiFillStar className='starred m-1'/> : ''}
      </h4>
      <Row className='m-2'>
        <Col xs={3}>
          <h6 className='fw-bold font-small mb-0'>Personal Record:</h6>
        </Col>
        <Col>
          <p className='font-small align-middle mb-0'>{TimeConvSec(pr_elapsed_time)}</p>
        </Col>
      </Row>
      <Row className='m-2'>
        <Col xs={3}>
          <h6 className='fw-bold font-small mb-0'>Record Date:</h6>
        </Col>
        <Col>
          <p className='font-small align-middle mb-0'>{DateConv(pr_date)}</p>
        </Col>
      </Row>
      <Row className='m-2'>
        <Col xs={3}>
          <h6 className='fw-bold font-small mb-0'>Days Since:</h6>
        </Col>
        <Col>
          <p className='font-small align-middle mb-0'>{timeSince(pr_date)}</p>
        </Col>
      </Row>
      <Row className='m-2'>
        <Col xs={3}>
          <h6 className='fw-bold font-small mb-0'>Total Efforts:</h6>
        </Col>
        <Col>
        <p className='font-small align-middle mb-0'>{effort_count}</p>
        </Col>
      </Row>
      <Row className='m-2'>
        <p className='align-middle mb-0 link text-center'>
          <a target='_blank' href={`https://www.strava.com/activities/${pr_activity_id}`}>View your PR on Strava</a>
        </p>
      </Row>
    </Container>
  )
}

export default SegmentPersonalStats