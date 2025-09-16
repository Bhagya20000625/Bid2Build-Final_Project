import React from 'react';
import Header from './landing/Header';
import HeroSection from './landing/HeroSection';
import HowItWork from './landing/HowItWork';
import FeaturedCategories from './landing/FeaturedCategories';
import Footer from './landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <HowItWork />
      <FeaturedCategories />
      <Footer />
    </div>
  );
};

export default LandingPage;