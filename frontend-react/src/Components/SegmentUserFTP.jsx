import Container from "react-bootstrap/Container"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const SegmentUserFTP = ({ FTP, setFTP }) => {
  return (
    <Container className='tile' fluid='md'>
    <h6 htmlFor="rider-FTP" className="form-label fw-bold text-center mb-3">Rider FTP</h6>
    <InputGroup className="mb-3" >
      <Form.Control
        defaultValue={FTP}
        aria-label="rider-FTP"
        aria-describedby="rider-FTP"
        type="number"
        min={0}
        onChange={e => setFTP(Number(e.target.value)) }
      />
      <InputGroup.Text id="rider-FTP-unit">W</InputGroup.Text>
    </InputGroup>
  </Container> 
  )
}

export default SegmentUserFTP