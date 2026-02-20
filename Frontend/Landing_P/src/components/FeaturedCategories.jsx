import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Shield,
  Users,
  Star,
  Building2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

// Constants
const SERVICES = [
  {
    title: "Project Marketplace",
    description:
      "Post your construction projects and connect with verified professionals instantly",
    icon: Building2,
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop&q=80",
    stats: "2.4K+ Projects",
    color: "blue",
  },
  {
    title: "Competitive Bidding",
    description:
      "Contractors, suppliers, and architects compete for your project with transparent pricing",
    icon: Users,
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&q=80",
    stats: "95% Fair Pricing",
    color: "green",
  },
  {
    title: "Secure Platform",
    description:
      "Escrow-based payments and real-time communication ensure project success",
    icon: Shield,
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&q=80",
    stats: "100% Protected",
    color: "purple",
  },
];

const FEATURES = [
  {
    icon: Building2,
    title: "Easy Project Posting",
    description:
      "Simple interface to post construction projects and reach qualified professionals",
    color: "blue",
  },
  {
    icon: Users,
    title: "Competitive Bidding",
    description:
      "Multiple contractors bid on your project ensuring best value and quality",
    color: "green",
  },
  {
    icon: MessageCircle,
    title: "Real-time Communication",
    description:
      "Built-in messaging and notifications keep everyone connected and informed",
    color: "orange",
  },
  {
    icon: Shield,
    title: "Secure Escrow Payments",
    description:
      "Protected payments released only when milestones are completed successfully",
    color: "purple",
  },
  {
    icon: Star,
    title: "Transparent Evaluation",
    description:
      "Automated bid assessment and user ratings ensure fair project awards",
    color: "yellow",
  },
];

const COLOR_VARIANTS = {
  blue: {
    bg: "bg-blue-500",
    hover: "hover:bg-blue-600",
    text: "text-blue-600",
    light: "bg-blue-50",
    border: "border-blue-500",
  },
  green: {
    bg: "bg-green-500",
    hover: "hover:bg-green-600",
    text: "text-green-600",
    light: "bg-green-50",
    border: "border-green-500",
  },
  purple: {
    bg: "bg-purple-500",
    hover: "hover:bg-purple-600",
    text: "text-purple-600",
    light: "bg-purple-50",
    border: "border-purple-500",
  },
  orange: {
    bg: "bg-orange-500",
    hover: "hover:bg-orange-600",
    text: "text-orange-600",
    light: "bg-orange-50",
    border: "border-orange-500",
  },
  yellow: {
    bg: "bg-yellow-500",
    hover: "hover:bg-yellow-600",
    text: "text-yellow-600",
    light: "bg-yellow-50",
    border: "border-yellow-500",
  },
};

// Subcomponents
const ServiceIcon = ({ Icon, isActive, color = "blue" }) => {
  const colors = COLOR_VARIANTS[color];

  return (
    <div
      className={`
      w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
      ${
        isActive
          ? `${colors.bg} text-white shadow-lg`
          : `bg-slate-100 text-slate-600 group-hover:${colors.light} group-hover:${colors.text}`
      }
    `}
    >
      <Icon className="w-5 h-5" />
    </div>
  );
};

const ServiceCard = ({ service, index, isActive, onActivate }) => {
  const colors = COLOR_VARIANTS[service.color];

  return (
    <div
      className={`
        group p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer transform
        ${
          isActive
            ? `${colors.border} ${colors.light} shadow-xl scale-105`
            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg hover:-translate-y-1"
        }
      `}
      onClick={onActivate}
    >
      <div className="flex items-start gap-4">
        <ServiceIcon
          Icon={service.icon}
          isActive={isActive}
          color={service.color}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 text-lg leading-tight">
              {service.title}
            </h3>
            <span
              className={`
              text-xs px-3 py-1 rounded-full font-medium transition-colors whitespace-nowrap
              ${
                isActive
                  ? `${colors.bg} text-white`
                  : "bg-slate-200 text-slate-600 group-hover:bg-slate-300"
              }
            `}
            >
              {service.stats}
            </span>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>

      {isActive && (
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 ${colors.bg} rounded-b-2xl`}
        />
      )}
    </div>
  );
};

const ServiceVisual = ({ service }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative group">
      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
        <img
          src={service.image}
          alt={service.title}
          className={`
            w-full h-full object-cover transition-all duration-700
            ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
            group-hover:scale-110
          `}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-2xl font-bold mb-2 leading-tight">
                {service.title}
              </h4>
              <p className="text-white/90 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
            <div
              className={`
              w-10 h-10 rounded-lg flex items-center justify-center ml-4 transition-transform group-hover:scale-110
              ${COLOR_VARIANTS[service.color].bg}
            `}
            >
              <service.icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse" />
        )}
      </div>
    </div>
  );
};

const FeatureCard = ({ feature, index }) => {
  const colors = COLOR_VARIANTS[feature.color];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group p-5 bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 text-center transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
        w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300
        ${
          isHovered
            ? `${colors.bg} text-white shadow-lg transform scale-110`
            : `${colors.light} ${colors.text}`
        }
      `}
      >
        <feature.icon className="w-6 h-6" />
      </div>

      <h4 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
        {feature.title}
      </h4>
      <p className="text-xs text-gray-600 leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
};

const StatsBar = ({ activeService }) => (
  <div className="flex items-center justify-center gap-8 mb-8 p-4 bg-slate-50 rounded-xl">
    <div className="text-center">
      <div className="text-2xl font-bold text-blue-600 mb-1">15K+</div>
      <div className="text-xs text-slate-600">Active Users</div>
    </div>
    <div className="text-center">
      <div className="text-2xl font-bold text-green-600 mb-1">98%</div>
      <div className="text-xs text-slate-600">Success Rate</div>
    </div>
    <div className="text-center">
      <div className="text-2xl font-bold text-purple-600 mb-1">$2.1M</div>
      <div className="text-xs text-slate-600">Projects Value</div>
    </div>
  </div>
);

// Main Component
const PlatformServices = () => {
  const [activeService, setActiveService] = useState(0);

  // Auto-rotate services for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % SERVICES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Smart <span className="text-blue-600">Construction Platform</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Connecting customers with verified construction professionals
            through transparent bidding and secure project management
          </p>
        </header>

        <StatsBar activeService={activeService} />

        {/* Main Services */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Services List */}
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

          {/* Visual Display */}
          <div className="lg:pl-8">
            <ServiceVisual service={SERVICES[activeService]} />
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Why Choose Our Platform?
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Comprehensive tools and features designed to make your
              construction projects successful
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {FEATURES.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformServices;
