import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import { BiCycling } from 'react-icons/bi'
import { FaMountain } from 'react-icons/fa'
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

import ConnectStrava from '../Logos/ConnectStrava.svg'

const NavBar = () => {
  let buttonWidth
  if (window.innerWidth < 600) buttonWidth = '100px'
  else buttonWidth = '150px'

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
        <Button id='connect-strava' className='border-0 m-0 p-0' >
          <Image  style={{width: buttonWidth}} className='m-0' src={ConnectStrava} alt='Connect with Strava' rounded />
        </Button>
      </Container>
    </Navbar>
  
    
  );
}

export default NavBar;
