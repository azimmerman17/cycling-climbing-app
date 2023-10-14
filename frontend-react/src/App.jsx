import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react';

import './App.css';
import NavBar from './Components/Navbar';
import Segment from './Components/Segment';
import Footer from './Components/Footer';
import Profile from './Components/Profile';
import CurrentUserProvider from './Context/CurrentUser';
import SegmentList from './Components/SegmentList';


const App = () => {
  let [segmentList, setSegmentList] = useState()
  let pageHeight = window.innerHeight - 2 * 56

  return (
    <div className="App">
      <CurrentUserProvider >
        <Router>
            <NavBar />
              <Routes>
                {/* <Route exact path='/' element={<Home />} />  */}
                <Route path='/segment' element={<SegmentList />}  />
                <Route path='/segment/:segmentId' element={<Segment />} />
                <Route path='/profile' element={<Profile />} />

              </Routes>
            <Footer />
        </Router>
      </CurrentUserProvider>
    </div>
  );
}

export default App;
