import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  Shield,
  Clock,
  Award,
  Search,
  MessageSquare,
  FileText,
  ArrowRight,
  CheckCircle,
  Phone,
} from 'lucide-react';
import SectionAnimator from './ui/SectionAnimator';
import Header from './landing/Header';
import Footer from './landing/Footer';

const Services = () => {
  const services = [
    {
      icon: Search,
      title: 'Project Bidding',
      description:
        'Connect with verified contractors and receive competitive bids.',
    },
    {
      icon: Users,
      title: 'Contractor Network',
      description: 'Access pre-vetted, licensed construction professionals.',
    },
    {
      icon: FileText,
      title: 'Project Management',
      description: 'Track timelines, milestones, and project progress.',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Protected transactions with escrow services.',
    },
    {
      icon: MessageSquare,
      title: 'Communication Hub',
      description: 'Centralized messaging and file sharing platform.',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Professional inspections and quality control.',
    },
  ];

  const stats = [
    { number: '15,000+', label: 'Projects Completed' },
    { number: '8,500+', label: 'Verified Contractors' },
    { number: '99.2%', label: 'Customer Satisfaction' },
    { number: '24/7', label: 'Support Available' },
  ];

  const handleGetStarted = () => {
    console.log('Navigate to registration');
  };

  return (
    <div className="min-h-screen">
      <Header />

      <section id="services" className="py-32 pt-40">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <SectionAnimator>
            <div className="text-center mb-20">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold text-foreground mb-6 uppercase"
              >
                OUR <span className="text-gradient">SERVICES</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-foreground/70 max-w-2xl mx-auto"
              >
                Everything you need for successful construction projects
              </motion.p>
            </div>
          </SectionAnimator>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass glow-border rounded-2xl p-8 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-purple rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/50">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 uppercase tracking-wide">
                    {service.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Stats */}
          <SectionAnimator delay={0.4}>
            <div className="glass glow-border rounded-2xl p-12 mb-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-4xl font-bold text-gradient mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-foreground/60 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </SectionAnimator>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;