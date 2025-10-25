import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';

function App() {
  return (
    <div>
      {/* <Routes> */}
        {/* Parent route with layout */}
        {/* <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes> */}
      <LandingPage/>
    </div>
  );
}

export default App