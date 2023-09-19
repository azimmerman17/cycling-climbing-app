import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css';
import NavBar from './Components/Navbar';
import Segment from './Components/Segment';
import Footer from './Components/Footer';


const App = () => {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          {/* <Route exact path='/' element={<Home />} />  */}
          {/* <Route path='/segment' element={<Segments />} /> */}
          <Route path='/segment/:segmentId' element={<Segment />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
