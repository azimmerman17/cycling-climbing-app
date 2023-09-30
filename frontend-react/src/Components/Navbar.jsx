import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { BiCycling } from 'react-icons/bi'
import { FaMountain } from 'react-icons/fa'
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { useContext } from "react"

import ConnectStrava from '../Logos/ConnectStrava.svg'
import { CurrentUser } from "../Context/CurrentUser"

const NavBar = () => {
  const { currentUser } = useContext(CurrentUser)
  // styling for login button, depending on window size
  let buttonWidth
  if (window.innerWidth < 600) buttonWidth = '100px'
  else buttonWidth = '150px'

  const handleLogin = async (e) => {
    e.preventDefault()

    const redirectUri = 'http://localhost:8080/auth/strava/return'
    const scope = 'read_all,profile:read_all,profile:write,activity:read_all'
    const responseType = 'code'

    window.location = `http://www.strava.com/oauth/authorize?client_id=52719&response_type=${responseType}&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`
  }

  const handleLogout = async (e) => {
    let response = await fetch(`http://localhost:8080/user/clear`, {
          mode: 'cors'
        })
    
  }

  const stravaConnection = (user) => {
    if (user) {
      return (
        <Nav.Link href='/profile' onClick={e => handleLogout(e)}>Logout</Nav.Link>
      )    
    } else if (user === null) { 
      return (
          <Button id='connect-strava' className='border-0 m-0 p-0' onClick={e => handleLogin(e)}>
            <Image  style={{width: buttonWidth}} className='m-0' src={ConnectStrava} alt='Connect with Strava' rounded />
          </Button>
      )
    }
  }

  return (
    <Navbar bg="dark" variant="dark" className='nav-height' collapseOnSelect expand="md">
      <Container>
        <Navbar.Brand href="/">
          <BiCycling className='climb-logo'/>
          <FaMountain />
        <span className='p-2'>
          Cycling Climbs
        </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link href='/segment'>Segments</Nav.Link>
            <Nav.Link href='/profile'>Profile</Nav.Link>
            {stravaConnection(currentUser)}
          </Nav>
        </Navbar.Collapse>
        
      </Container>
    </Navbar>
  
    
  );
}

export default NavBar;
