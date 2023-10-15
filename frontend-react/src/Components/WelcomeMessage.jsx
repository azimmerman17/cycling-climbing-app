import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row";
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { useContext } from "react"

import { CurrentUser } from "../Context/CurrentUser"
import ConnectStrava from '../Logos/ConnectStrava.svg'

const WelcomeMessage = () => {
  const { currentUser } = useContext(CurrentUser)
  console.log(currentUser)

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

  const displayLoggedIn = (user) => {
    console.log(user)
    const {first_name, profile_pic} = user
    return (
      <Container className="bg-white p-3  text-center">
        <h4>Welcome {first_name}</h4>
        <Image style={{width: profileWidth, margin: 'auto'}}  src={`http://${profile_pic}`} alt="profile picture" roundedCircle/>
        <p className='text-center m-2'>Input a Strava Segment Id or select one to continue.</p>
      </Container>
    )
  }

  const displayNotLoggedIn = () => {
    return (
      <Container className="bg-white m-3">
        <Row style={{width: '100%', margin: 'auto'}}>
          <h4 className="my-3 text-center">Welcome to my Cycling App</h4>
          <p className="text-center">Please connect to Strava to continue</p>
        </Row>
        <Row style={{width: '100%', margin: 'auto'}}>
          <Button style={{width: buttonWidth, margin: 'auto'}} id='connect-strava' className='border-0 my-3 p-0' onClick={e => handleLogin(e)}>
            <Image style={{width: buttonWidth}} className='m-0' src={ConnectStrava} alt='Connect with Strava' rounded />
          </Button>
        </Row>
      </Container>
    )
  }

  return (
    <div>
      {currentUser ? displayLoggedIn(currentUser) :  displayNotLoggedIn()}
    </div>
  )
}

export default WelcomeMessage