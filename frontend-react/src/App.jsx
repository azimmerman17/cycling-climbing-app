import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css';
import NavBar from './Components/Navbar';
import Segment from './Components/Segment';


const App = () => {
  return (
    <div className="App">
      <Router>
        <NavBar></NavBar>
        Cycling Climbs
        <Routes>
          {/* <Route exact path='/' element={<Home />} />  */}
          {/* <Route path='/segment' element={<Segments />} /> */}
          <Route path='/segment/:segmentId' element={<Segment />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
