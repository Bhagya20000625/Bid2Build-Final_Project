import React from "react";
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
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Search,
      title: "Project Bidding",
      description:
        "Connect with verified contractors and receive competitive bids.",
    },
    {
      icon: Users,
      title: "Contractor Network",
      description: "Access pre-vetted, licensed construction professionals.",
    },
    {
      icon: FileText,
      title: "Project Management",
      description: "Track timelines, milestones, and project progress.",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Protected transactions with escrow services.",
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description: "Centralized messaging and file sharing platform.",
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Professional inspections and quality control.",
    },
  ];

  const stats = [
    { number: "15,000+", label: "Projects Completed" },
    { number: "8,500+", label: "Verified Contractors" },
    { number: "99.2%", label: "Customer Satisfaction" },
    { number: "24/7", label: "Support Available" },
  ];

  const handleGetStarted = () => {
    console.log("Navigate to registration");
  };

  return (
    <section id="services" className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need for successful construction projects
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;