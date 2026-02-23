import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Shield,
  Users,
  Building2,
  Globe,
  Award,
} from 'lucide-react';
import SectionAnimator from './ui/SectionAnimator';
import Header from './landing/Header';
import Footer from './landing/Footer';

// Constants
const INNOVATIONS = [
  {
    icon: Users,
    title: 'Competitive Bidding',
    description:
      'Transparent marketplace where contractors compete for projects with real-time pricing.',
    tech: 'Smart Matching',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description:
      'Protected escrow system with milestone-based releases and dispute resolution.',
    tech: 'Bank-Grade Security',
  },
  {
    icon: Zap,
    title: 'Real-Time Hub',
    description:
      'Centralized platform with messaging, file sharing, and progress tracking.',
    tech: 'Cloud Collaboration',
  },
];

const METRICS = [
  { value: '50K+', label: 'Professionals' },
  { value: '2.5M+', label: 'Projects' },
  { value: '$1.2B+', label: 'Value' },
  { value: '95%', label: 'Success Rate' },
];

const FEATURES = [
  'Connect with verified construction professionals',
  'Transparent bidding with competitive pricing',
  'Secure escrow payments and milestone tracking',
  'Real-time communication and file sharing',
  'Professional ratings and quality assurance',
  'Comprehensive project management tools',
];

// Components
const InnovationCard = ({ innovation, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="p-8 glass glow-border rounded-2xl transition-all duration-300"
  >
    <div className="w-14 h-14 bg-gradient-purple rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/50">
      <innovation.icon className="w-7 h-7" />
    </div>
    <h3 className="text-2xl font-bold text-foreground mb-4 uppercase tracking-wide">
      {innovation.title}
    </h3>
    <p className="text-foreground/70 mb-4 leading-relaxed">{innovation.description}</p>
    <div className="text-sm text-primary bg-primary/10 px-4 py-2 rounded-full inline-block font-medium">
      {innovation.tech}
    </div>
  </motion.div>
);

const MetricCard = ({ metric, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="text-center glass glow-border rounded-2xl p-6"
  >
    <div className="text-4xl font-bold text-gradient mb-2">{metric.value}</div>
    <div className="text-sm text-foreground/60 uppercase tracking-wider">{metric.label}</div>
  </motion.div>
);

const FeatureItem = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    className="flex items-start gap-4 p-5 glass glow-border rounded-xl hover:border-primary/50 transition-all duration-300"
  >
    <div className="w-2 h-2 bg-gradient-purple rounded-full mt-2 flex-shrink-0"></div>
    <span className="text-foreground/80">{feature}</span>
  </motion.div>
);

// Main Component
const About = () => {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="py-32 px-6 pt-40">
        <SectionAnimator>
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-foreground mb-6 uppercase"
            >
              INNOVATION MEETS
              <span className="block text-gradient">CONSTRUCTION</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-foreground/70 mb-16 max-w-3xl mx-auto leading-relaxed"
            >
              Bid2Build connects clients with verified professionals through
              transparent bidding and secure project management.
            </motion.p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {METRICS.map((metric, i) => (
                <MetricCard key={i} metric={metric} index={i} />
              ))}
            </div>
          </div>
        </SectionAnimator>
      </section>

      {/* Innovations */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionAnimator className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4 uppercase">
              HOW WE <span className="text-gradient">WORK</span>
            </h2>
            <p className="text-xl text-foreground/60">
              Simple technology that makes construction projects easier.
            </p>
          </SectionAnimator>

          <div className="grid lg:grid-cols-3 gap-8">
            {INNOVATIONS.map((innovation, i) => (
              <InnovationCard key={i} innovation={innovation} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
        <SectionAnimator>
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 uppercase text-foreground">
              OUR <span className="text-gradient">MISSION</span>
            </h2>
            <p className="text-xl text-foreground/70 mb-16 max-w-3xl mx-auto leading-relaxed">
              Make construction projects simple, transparent, and successful for
              everyone involved.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center glass glow-border rounded-2xl p-8"
              >
                <div className="text-4xl font-bold text-gradient mb-3">40%</div>
                <div className="text-foreground/60 uppercase tracking-wider text-sm">Faster Delivery</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center glass glow-border rounded-2xl p-8"
              >
                <div className="text-4xl font-bold text-gradient mb-3">35%</div>
                <div className="text-foreground/60 uppercase tracking-wider text-sm">Cost Savings</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center glass glow-border rounded-2xl p-8"
              >
                <div className="text-4xl font-bold text-gradient mb-3">98%</div>
                <div className="text-foreground/60 uppercase tracking-wider text-sm">Satisfaction</div>
              </motion.div>
            </div>
          </div>
        </SectionAnimator>
      </section>

      {/* Features */}
      <section className="py-24 px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <SectionAnimator className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4 uppercase">
              WHAT WE <span className="text-gradient">OFFER</span>
            </h2>
            <p className="text-xl text-foreground/60">
              Everything you need for successful construction projects.
            </p>
          </SectionAnimator>

          <div className="grid md:grid-cols-2 gap-4">
            {FEATURES.map((feature, i) => (
              <FeatureItem key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;