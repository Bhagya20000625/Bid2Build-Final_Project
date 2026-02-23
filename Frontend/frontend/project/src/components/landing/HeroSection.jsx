import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import heroVideo from '../../../Background_video/hero-video.mp4';

const HeroSection = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: '10K+',
      label: 'ACTIVE USERS',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      value: '5K+',
      label: 'PROJECTS COMPLETE',
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: '98%',
      label: 'SUCCESS RATE',
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Video Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90 -z-10" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            READY TO{' '}
            <span className="text-gradient uppercase">BID</span>
            ?
            <br />
            <span className="text-4xl md:text-6xl lg:text-7xl text-foreground/90">
              LET'S BUILD TOGETHER
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-foreground/70 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Discover opportunities.{' '}
            <span className="text-primary font-medium">Post projects.</span>{' '}
            <span className="text-primary-light font-medium">
              Bid competitively.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
          >
            <Button
              variant="gradient"
              size="lg"
              onClick={() => navigate('/register')}
              className="group uppercase tracking-wide"
            >
              Start Building
              <motion.div
                whileHover={{ rotate: 45 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.div>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/about')}
              className="uppercase tracking-wide"
            >
              Learn More
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass glow-border rounded-2xl p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 glass rounded-xl mb-4 text-primary">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-foreground/60 text-sm font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-foreground/40 text-center"
      >
        <div className="text-sm mb-2 uppercase tracking-wider">Scroll to explore</div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-0.5 h-12 bg-gradient-purple mx-auto"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;