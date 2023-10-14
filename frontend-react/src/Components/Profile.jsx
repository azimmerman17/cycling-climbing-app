import { useContext } from "react"
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";



import { CurrentUser } from "../Context/CurrentUser"
import ConnectStrava from '../Logos/ConnectStrava.svg'

const Profile = () => {
  const { currentUser } = useContext(CurrentUser)

  let buttonWidth
  let profileWidth
  if (window.innerWidth < 600) {
    buttonWidth = '200px'
    profileWidth = '100px'
  }
  else {
    buttonWidth = '250px'
    profileWidth = '150px'

  }

  const handleLogin = async (e) => {
    e.preventDefault()

    const redirectUri = 'http://localhost:8080/auth/strava/return'
    const scope = 'read_all,profile:read_all,profile:write,activity:read_all'
    const responseType = 'code'

    window.location = `http://www.strava.com/oauth/authorize?client_id=52719&response_type=${responseType}&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`
  }

  if (currentUser === null) {
    return (
      <Container className="bg-white main-height">
        <Row style={{width: '100%', margin: 'auto'}}>
          <h6 className="my-3 text-center" >
            Please log into strava in view your Profile
          </h6>
        </Row>
        <Row style={{width: '100%', margin: 'auto'}}>
          <Button style={{width: buttonWidth, margin: 'auto'}} id='connect-strava' className='border-0 my-3 p-0' onClick={e => handleLogin(e)}>
            <Image style={{width: buttonWidth}} className='m-0' src={ConnectStrava} alt='Connect with Strava' rounded />
          </Button>
        </Row>
      </Container>
    )
  } else if (currentUser === undefined) return null
  else {
    const { first_name , ftp, last_name, profile_pic, sex, strava_id, weight, height, prefer_units } = currentUser
    let displayWeight = weight

    if (prefer_units === 'Imperial') displayWeight = (weight * 2.21).toFixed(1)

    return (
      <Container className='main-height p-3 text-center' >
        <Row className="m-3">
          <Image style={{width: profileWidth, margin: 'auto'}}  src={`http://${profile_pic}`} alt="profile picture" roundedCircle/>
        </Row>
        <Row >
          <Col>{first_name && last_name ? <h5 className="text-center">{first_name} {last_name}</h5> : null}</Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={3} className="p-2 m-2 shadow rounded text-center">
            <h6>{ftp ? ftp : 'N/A'} W</h6>
            <small className="disclaimer">FTP</small>
          </Col>
          <Col  xs={3} className="p-2 m-2 shadow rounded text-center">
            <h6>{displayWeight ? displayWeight : 'N/A'} {prefer_units === 'Imperial' ? 'lb' : 'kg'}</h6>
            <small className="disclaimer">WEIGHT</small>
          </Col>
          <Col xs={3} className="p-2 m-2 shadow rounded text-center">
            <h6>{height ? height : 'N/A'}</h6>
            <small className="disclaimer">HEIGHT</small>
          </Col>
          <Col xs={3} className="p-2 m-2 shadow rounded text-center">
            <h6>{sex ? sex : 'N/A'}</h6>
            <small className="disclaimer">SEX</small>
          </Col>
          <Col xs={3} className="p-2 m-2 shadow rounded text-center">
            <h6>{prefer_units}</h6>
            <small className="disclaimer">UNITS</small>
          </Col>
          <Col xs={3} className="p-2 m-2 shadow rounded text-center">
          <h6>{strava_id ? strava_id : 'N/A'}</h6>
            <small className="disclaimer">STRAVA ID</small>
          </Col>
        </Row>
        <Row>
          <p className="text-center disclaimer">If any of this data needs to be edited, please do so on your Strava Profile.</p>
        </Row>
      </Container>
    )
  }
}

export default Profile
