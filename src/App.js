import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Landing_Page from './Components/Landing_Page/Landing_Page';
import Sign_Up from './Components/Sign_up/Sign_Up';
import Login from './Components/Login/Login';
import AuthDebug from './Components/AuthDebug';
import InstantConsultation from './Components/InstantConsultationBooking/InstantConsultation';
import Reviews from './Components/Reviews/Reviews';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing_Page />} />
          <Route path="/signup" element={<Sign_Up />} />
          <Route path="/login" element={<Login />} />
          <Route path="/instant-consultation" element={<InstantConsultation />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/debug" element={<AuthDebug />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;