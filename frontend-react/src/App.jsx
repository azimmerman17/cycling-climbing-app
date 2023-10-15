import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react';

import './App.css';
import NavBar from './Components/Navbar';
import Segment from './Components/Segment';
import Footer from './Components/Footer';
import Profile from './Components/Profile';
import CurrentUserProvider from './Context/CurrentUser';
import SegmentList from './Components/SegmentList';
import SegmentRequest from './Components/SegmentRequest';
import HomePage from './Components/HomePage';


const App = () => {
  let [segmentList, setSegmentList] = useState()

  return (
    <div className="App">
      <CurrentUserProvider >
        <Router>
            <NavBar />
              <Routes>
                <Route exact path='/' element={<HomePage />} /> 
                <Route path='/segment' element={<SegmentList />}  />
                <Route path='/segment/:segmentId' element={<Segment />} />
                <Route path='/segment/request' element={<SegmentRequest />} />
                <Route path='/profile' element={<Profile />} />

              </Routes>
            <Footer />
        </Router>
      </CurrentUserProvider>
    </div>
  );
}

export default App;
