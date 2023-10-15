import Container from "react-bootstrap/Container"
import WelcomeMessage from "./WelcomeMessage"


const HomePage = ({}) => {
  return(
    <Container className="bg-white main-height">
      <WelcomeMessage />
    </Container>
  )
}

export default HomePage