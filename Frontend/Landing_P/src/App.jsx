import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HowItWork from './components/HowItWork';
import FeaturedCategories from './components/FeaturedCategories';
import Footer from './components/Footer';
import Services from './components/Services';
import About from './components/About';  // Import About page

// Home Page Component
const HomePage = () => {
  return (
    <>
      <HeroSection />
      <HowItWork />
      <FeaturedCategories />
    </>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />   {/* Added About route */}
      </Routes>
      
      <Footer />
    </div>
  );
};

export default App;
