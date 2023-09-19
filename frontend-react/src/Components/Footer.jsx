import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import { BiCycling } from 'react-icons/bi'
import { FaMountain } from 'react-icons/fa'

import PoweredStrava from '../Logos/PoweredStrava.svg'

const Footer = () => {
  let buttonWidth
  if (window.innerWidth < 600) buttonWidth = '100px'
  else buttonWidth = '150px'

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <BiCycling className='climb-logo'/>
          <FaMountain />
        </Navbar.Brand>
        <Image  style={{width: buttonWidth}} className='m-0' src={PoweredStrava} alt='Powered by Strava' rounded />
      </Container>
    </Navbar>
  )
}

export default Footer