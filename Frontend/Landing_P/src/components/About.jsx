import React, { useState } from "react";
import {
  ArrowRight,
  Zap,
  Shield,
  Users,
  Building2,
  Globe,
  Award,
} from "lucide-react";

// Constants
const INNOVATIONS = [
  {
    icon: Users,
    title: "Competitive Bidding",
    description:
      "Transparent marketplace where contractors compete for projects with real-time pricing.",
    tech: "Smart Matching",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Protected escrow system with milestone-based releases and dispute resolution.",
    tech: "Bank-Grade Security",
  },
  {
    icon: Zap,
    title: "Real-Time Hub",
    description:
      "Centralized platform with messaging, file sharing, and progress tracking.",
    tech: "Cloud Collaboration",
  },
];

const METRICS = [
  { value: "50K+", label: "Professionals" },
  { value: "2.5M+", label: "Projects" },
  { value: "$1.2B+", label: "Value" },
  { value: "95%", label: "Success Rate" },
];

const FEATURES = [
  "Connect with verified construction professionals",
  "Transparent bidding with competitive pricing",
  "Secure escrow payments and milestone tracking",
  "Real-time communication and file sharing",
  "Professional ratings and quality assurance",
  "Comprehensive project management tools",
];

// Components
const InnovationCard = ({ innovation, index }) => (
  <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
      <innovation.icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{innovation.title}</h3>
    <p className="text-gray-600 mb-4">{innovation.description}</p>
    <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
      {innovation.tech}
    </div>
  </div>
);

const MetricCard = ({ metric }) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
    <div className="text-sm text-gray-600">{metric.label}</div>
  </div>
);

const FeatureItem = ({ feature }) => (
  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
    <span className="text-gray-700">{feature}</span>
  </div>
);

// Main Component
const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Innovation Meets
            <span className="block text-blue-600">Construction</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Bid2Build connects clients with verified professionals through
            transparent bidding and secure project management.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {METRICS.map((metric, i) => (
              <MetricCard key={i} metric={metric} />
            ))}
          </div>
        </div>
      </section>

      {/* Innovations */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How We Work
            </h2>
            <p className="text-xl text-gray-600">
              Simple technology that makes construction projects easier.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {INNOVATIONS.map((innovation, i) => (
              <InnovationCard key={i} innovation={innovation} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Make construction projects simple, transparent, and successful for
            everyone involved.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">40%</div>
              <div className="text-gray-400">Faster Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">35%</div>
              <div className="text-gray-400">Cost Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
              <div className="text-gray-400">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for successful construction projects.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {FEATURES.map((feature, i) => (
              <FeatureItem key={i} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
