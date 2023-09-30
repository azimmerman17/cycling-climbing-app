import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css';
import NavBar from './Components/Navbar';
import Segment from './Components/Segment';
import Footer from './Components/Footer';
import Profile from './Components/Profile';
import CurrentUserProvider from './Context/CurrentUser';


const App = () => {
  console.log(localStorage)

  return (
    <div className="App">
      <CurrentUserProvider >
        <Router>
            <NavBar />
            <Routes>
              {/* <Route exact path='/' element={<Home />} />  */}
              {/* <Route path='/segment' element={<Segments />} /> */}
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
