import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import SegmentStats from './SegmentStats'
import SegmentPersonalStats from './SegmentPersonalStats'
import SegmentKomStats from './SegmentKomStats'

const SegmentDetailView = ({ data, unit }) => {
  const { average_grade, athlete_count, athlete_segment_stats, city, country, effort_count, elevation_high, elevation_low, end_latlng, hazardous, local_legend, starred, start_latlng, state, total_elevation_gain, xoms } = data

  const segmentData = {
    average_grade,
    athlete_count,
    city,
    country,
    effort_count,
    elevation_high,
    elevation_low,
    hazardous,
    start_latlng,
    state
  }

  const KomData = {
    xoms,
    local_legend
  }
  return (
    <Container >
      <Row>
        <Col xs={12} md={4}>
          <SegmentStats data={segmentData} unit={unit} />
        </Col>
        <Col xs={12} md ={4}>
          <SegmentPersonalStats data={athlete_segment_stats} starred={starred} />
        </Col>
        <Col xs={12} md={4}>
          <SegmentKomStats data={KomData} />
        </Col>

      </Row>
    </Container>
  )
}

export default SegmentDetailView
