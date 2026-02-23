import React from 'react';
import { motion } from 'framer-motion';
import Header from './landing/Header';
import HeroSection from './landing/HeroSection';
import HowItWork from './landing/HowItWork';
import FeaturedCategories from './landing/FeaturedCategories';
import Footer from './landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
        <HowItWork />
        <FeaturedCategories />
      </motion.main>
      <Footer />
    </div>
  );
};

export default LandingPage;