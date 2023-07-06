import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import { BiCycling } from 'react-icons/bi'
import { FaMountain } from 'react-icons/fa'


const NavBar = () => {
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
         </Container>
       </Navbar>
  
    
  );
}

export default NavBar;
