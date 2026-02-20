import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, CheckCircle, ArrowRight } from 'lucide-react';
import SectionAnimator from '../ui/SectionAnimator';

const STEPS = [
  {
    icon: FileText,
    title: 'Post Project',
    description: 'Define your vision with clear requirements and budget',
    details: 'Upload plans, set timeline, define scope',
  },
  {
    icon: Users,
    title: 'Get Proposals',
    description: 'Receive competitive bids from verified professionals',
    details: 'Review portfolios, compare pricing, check ratings',
  },
  {
    icon: CheckCircle,
    title: 'Build Together',
    description: 'Collaborate securely with milestone tracking',
    details: 'Escrow payments, progress updates, quality control',
  },
];

const STATS = [
  { value: '98%', label: 'Success Rate' },
  { value: '5K+', label: 'Projects' },
  { value: '24h', label: 'Avg Response' },
];

const StepCard = ({ step, index, isActive, onActivate }) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onActivate}
      className={`relative p-8 rounded-2xl cursor-pointer transition-all duration-300 ${
        isActive
          ? 'glass glow-border scale-105'
          : 'glass border border-border hover:border-primary/50'
      }`}
    >
      {/* Step Number */}
      <div className="absolute -top-4 -right-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
            isActive
              ? 'bg-gradient-purple text-white shadow-lg shadow-primary/50'
              : 'glass text-foreground/40'
          }`}
        >
          {index + 1}
        </div>
      </div>

      {/* Icon */}
      <div
        className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
          isActive
            ? 'bg-gradient-purple text-white'
            : 'glass text-primary'
        }`}
      >
        <step.icon className="w-8 h-8" />
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-foreground mb-3 uppercase tracking-wide">
        {step.title}
      </h3>
      <p className="text-foreground/70 mb-3 leading-relaxed">
        {step.description}
      </p>
      <p
        className={`text-sm transition-all duration-300 ${
          isActive ? 'text-primary font-medium' : 'text-foreground/50'
        }`}
      >
        {step.details}
      </p>

      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-purple rounded-b-2xl"
        />
      )}
    </motion.div>
  );
};

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <SectionAnimator className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 glass glow-border px-4 py-2 rounded-full text-sm font-medium mb-6 text-primary uppercase tracking-wider"
          >
            SIMPLE PROCESS
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4 uppercase">
            HOW IT <span className="text-gradient">WORKS</span>
          </h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            Three streamlined steps to bring your construction vision to life
          </p>
        </SectionAnimator>

        {/* Steps Cards */}
        <SectionAnimator delay={0.2}>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {STEPS.map((step, index) => (
              <StepCard
                key={step.title}
                step={step}
                index={index}
                isActive={activeStep === index}
                onActivate={() => setActiveStep(index)}
              />
            ))}
          </div>
        </SectionAnimator>

        {/* Progress Flow */}
        <SectionAnimator delay={0.4}>
          <div className="flex items-center justify-center mb-16">
            <div className="flex items-center gap-4">
              {STEPS.map((_, index) => (
                <React.Fragment key={index}>
                  <motion.div
                    animate={{
                      scale: index <= activeStep ? 1.2 : 1,
                      backgroundColor:
                        index <= activeStep ? '#9372FF' : 'rgba(147, 114, 255, 0.2)',
                    }}
                    className="w-3 h-3 rounded-full"
                  />
                  {index < STEPS.length - 1 && (
                    <motion.div
                      animate={{
                        width: index < activeStep ? '64px' : '48px',
                        backgroundColor:
                          index < activeStep ? '#9372FF' : 'rgba(147, 114, 255, 0.2)',
                      }}
                      className="h-0.5 transition-all duration-500"
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </SectionAnimator>

        {/* Bottom Section */}
        <SectionAnimator delay={0.6}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative group">
              <div className="aspect-video glass glow-border rounded-2xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/176342/pexels-photo-176342.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Construction collaboration"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight uppercase">
                BUILT FOR <span className="text-gradient">SUCCESS</span>
              </h3>
              <p className="text-lg text-foreground/60 mb-6 leading-relaxed">
                Our streamlined approach connects you with the right professionals
                while ensuring transparency and security throughout your project
                journey.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {STATS.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center glass glow-border rounded-xl p-4"
                  >
                    <div className="text-3xl font-bold text-gradient mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-foreground/60 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </SectionAnimator>
      </div>
    </section>
  );
};

export default HowItWorks;