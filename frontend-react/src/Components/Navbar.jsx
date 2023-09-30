import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import { BiCycling } from 'react-icons/bi'
import { FaMountain } from 'react-icons/fa'
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { useContext } from "react"

import ConnectStrava from '../Logos/ConnectStrava.svg'
import { CurrentUser } from "../Context/CurrentUser"

const NavBar = () => {
  const { currentUser } = useContext(CurrentUser)
    //styling for login button, depending on window size
  let buttonWidth
  if (window.innerWidth < 600) buttonWidth = '100px'
  else buttonWidth = '150px'

  console.log('NAV', currentUser)

  const handleLogin = async (e) => {
    e.preventDefault()

    const redirectUri = 'http://localhost:8080/auth/strava/return'
    const scope = 'read_all,profile:read_all,profile:write,activity:read_all'
    const responseType = 'code'

    window.location = `http://www.strava.com/oauth/authorize?client_id=52719&response_type=${responseType}&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`
  }

  const stravaConnection = (user) => {
    if (user) {
      // build out later
      const { profile_pic_medium } = user

      return <Image style={{maxHeight: '40px' }} className='m-0' src={`http://${profile_pic_medium}`} alt='Welcome' roundedCircle />
    } else if (user = null) { 
      return (
        <Button id='connect-strava' className='border-0 m-0 p-0' onClick={e => handleLogin(e)}>
          <Image  style={{width: buttonWidth}} className='m-0' src={ConnectStrava} alt='Connect with Strava' rounded />
        </Button>
      )
    }
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <BiCycling className='climb-logo'/>
          <FaMountain />
        <span className='p-2'>
          Cycling Climbs
        </span>
        </Navbar.Brand>
        {stravaConnection(currentUser)}
      </Container>
    </Navbar>
  
    
  );
}

export default NavBar;
