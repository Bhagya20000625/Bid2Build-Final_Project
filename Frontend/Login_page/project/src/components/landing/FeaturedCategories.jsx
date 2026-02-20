import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Shield,
  Users,
  Star,
  Building2,
  TrendingUp,
} from 'lucide-react';
import SectionAnimator from '../ui/SectionAnimator';

const SERVICES = [
  {
    title: 'Project Marketplace',
    description:
      'Post your construction projects and connect with verified professionals instantly',
    icon: Building2,
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop&q=80',
    stats: '2.4K+ Projects',
    color: 'primary',
  },
  {
    title: 'Competitive Bidding',
    description:
      'Contractors, suppliers, and architects compete for your project with transparent pricing',
    icon: Users,
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&q=80',
    stats: '95% Fair Pricing',
    color: 'primary',
  },
  {
    title: 'Secure Platform',
    description:
      'Escrow-based payments and real-time communication ensure project success',
    icon: Shield,
    image:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&q=80',
    stats: '100% Protected',
    color: 'primary',
  },
];

const FEATURES = [
  {
    icon: Building2,
    title: 'Easy Project Posting',
    description:
      'Simple interface to post construction projects and reach qualified professionals',
  },
  {
    icon: Users,
    title: 'Competitive Bidding',
    description:
      'Multiple contractors bid on your project ensuring best value and quality',
  },
  {
    icon: MessageCircle,
    title: 'Real-time Communication',
    description:
      'Built-in messaging and notifications keep everyone connected and informed',
  },
  {
    icon: Shield,
    title: 'Secure Escrow Payments',
    description:
      'Protected payments released only when milestones are completed successfully',
  },
  {
    icon: Star,
    title: 'Transparent Evaluation',
    description:
      'Automated bid assessment and user ratings ensure fair project awards',
  },
];

const ServiceCard = ({ service, index, isActive, onActivate }) => {
  return (
    <motion.div
      whileHover={{ x: 8 }}
      onClick={onActivate}
      className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
        isActive
          ? 'glass glow-border'
          : 'glass border border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isActive
              ? 'bg-gradient-purple text-white shadow-lg shadow-primary/50'
              : 'glass text-primary'
          }`}
        >
          <service.icon className="w-7 h-7" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-foreground text-lg leading-tight uppercase tracking-wide">
              {service.title}
            </h3>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-purple text-white'
                  : 'glass text-foreground/60'
              }`}
            >
              {service.stats}
            </span>
          </div>
          <p className="text-foreground/60 text-sm leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>

      {isActive && (
        <motion.div
          layoutId="activeServiceIndicator"
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-purple rounded-b-2xl"
        />
      )}
    </motion.div>
  );
};

const ServiceVisual = ({ service }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative group h-full">
      <div className="aspect-[4/3] glass glow-border rounded-2xl overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } group-hover:scale-110`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-2xl font-bold mb-2 leading-tight text-foreground uppercase tracking-wide">
                {service.title}
              </h4>
              <p className="text-foreground/80 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-purple rounded-xl flex items-center justify-center ml-4 transition-transform group-hover:scale-110 glow-border">
              <service.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {!imageLoaded && <div className="absolute inset-0 glass animate-pulse" />}
      </div>
    </div>
  );
};

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.05 }}
      className="group p-6 glass glow-border rounded-2xl text-center transition-all duration-300"
    >
      <div className="w-14 h-14 bg-gradient-purple rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/50">
        <feature.icon className="w-7 h-7 text-white" />
      </div>

      <h4 className="font-bold text-foreground mb-2 text-sm leading-tight uppercase tracking-wide">
        {feature.title}
      </h4>
      <p className="text-xs text-foreground/60 leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
};

const StatsBar = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex items-center justify-center gap-12 mb-12 p-6 glass glow-border rounded-2xl"
  >
    <div className="text-center">
      <div className="text-3xl font-bold text-gradient mb-1">15K+</div>
      <div className="text-xs text-foreground/60 uppercase tracking-wider">Active Users</div>
    </div>
    <div className="text-center">
      <div className="text-3xl font-bold text-gradient mb-1">98%</div>
      <div className="text-xs text-foreground/60 uppercase tracking-wider">Success Rate</div>
    </div>
    <div className="text-center">
      <div className="text-3xl font-bold text-gradient mb-1">$2.1M</div>
      <div className="text-xs text-foreground/60 uppercase tracking-wider">Projects Value</div>
    </div>
  </motion.div>
);

const PlatformServices = () => {
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % SERVICES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <SectionAnimator className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight uppercase">
            SMART <span className="text-gradient">CONSTRUCTION PLATFORM</span>
          </h2>
          <p className="text-xl text-foreground/60 max-w-3xl mx-auto leading-relaxed">
            Connecting customers with verified construction professionals
            through transparent bidding and secure project management
          </p>
        </SectionAnimator>

        <StatsBar />

        {/* Services Grid */}
        <SectionAnimator delay={0.2}>
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <div className="space-y-4">
              {SERVICES.map((service, index) => (
                <ServiceCard
                  key={service.title}
                  service={service}
                  index={index}
                  isActive={activeService === index}
                  onActivate={() => setActiveService(index)}
                />
              ))}
            </div>

            <div className="lg:pl-8">
              <ServiceVisual service={SERVICES[activeService]} />
            </div>
          </div>
        </SectionAnimator>

        {/* Features */}
        <SectionAnimator delay={0.4}>
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2 uppercase">
                WHY CHOOSE <span className="text-gradient">OUR PLATFORM?</span>
              </h3>
              <p className="text-foreground/60 max-w-2xl mx-auto">
                Comprehensive tools and features designed to make your
                construction projects successful
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {FEATURES.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </SectionAnimator>
      </div>
    </section>
  );
};

export default PlatformServices;