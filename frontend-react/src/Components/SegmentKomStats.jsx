import {GiPodiumWinner} from 'react-icons/gi'
import {GiChessKing} from 'react-icons/gi'
import {GiQueenCrown} from 'react-icons/gi'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const SegmentKomStats = ({ data }) => {
  const { xoms, local_legend } = data
  const { overall, kom, qom } = xoms
  const { effort_description } = local_legend

  return (
    <Container className='tile' fluid='md'>
      <h4 className='text-center m-2'>Course Records</h4>
      <Row className='m-2'>
        <Col xs={3}>
          <h5 className='text-center'>
            <GiPodiumWinner /> 
          </h5>
        </Col>
        <Col>
        <p className='font-small align-middle mb-0'>
            {overall}
          </p>
        </Col>
      </Row>
      <Row className='m-2'>
        <Col xs={3}>
          <h5 className='text-center'>
            <GiChessKing />
          </h5>
        </Col>
        <Col>
          <p className='font-small align-middle mb-0'>
            {kom}
          </p>
        </Col>
      </Row>
      <Row className='m-2'>
        <Col xs={3}>
          <h5 className='text-center'>
            <GiQueenCrown />
          </h5>
        </Col>
        <Col>
          <p className='font-small align-middle mb-0'>
            {qom}
          </p>
        </Col>
      </Row>
      <Row className='m-2'>
        <h5 className='text-center'>Local Legend</h5>
      </Row>
      <Row className='m-2'>
        <p className='font-small align-middle mb-0 text-center'>
          {effort_description}
        </p>
      </Row>
    </Container>
  )
}

export default SegmentKomStats