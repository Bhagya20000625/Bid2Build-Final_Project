import React, { useState } from "react";
import { ArrowRight, FileText, Users, CheckCircle } from "lucide-react";

// Constants
const STEPS = [
  {
    icon: FileText,
    title: "Post Project",
    description: "Define your vision with clear requirements and budget",
    details: "Upload plans, set timeline, define scope",
  },
  {
    icon: Users,
    title: "Get Proposals",
    description: "Receive competitive bids from verified professionals",
    details: "Review portfolios, compare pricing, check ratings",
  },
  {
    icon: CheckCircle,
    title: "Build Together",
    description: "Collaborate securely with milestone tracking",
    details: "Escrow payments, progress updates, quality control",
  },
];

const STATS = [
  { value: "98%", label: "Success Rate" },
  { value: "5K+", label: "Projects" },
  { value: "24h", label: "Avg Response" },
];

// Subcomponents
const StepNumber = ({ index, isActive, isHovered }) => (
  <div className="absolute -top-4 left-8">
    <div
      className={`
        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
        ${
          isActive
            ? "bg-blue-500 text-white shadow-lg"
            : isHovered
            ? "bg-gray-300 text-gray-700"
            : "bg-gray-200 text-gray-600"
        }
      `}
    >
      {index + 1}
    </div>
  </div>
);

const StepIcon = ({ Icon, isActive, isHovered }) => (
  <div
    className={`
      w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300
      ${
        isActive
          ? "bg-blue-500 text-white shadow-md"
          : isHovered
          ? "bg-gray-200 text-gray-700"
          : "bg-gray-100 text-gray-600"
      }
    `}
  >
    <Icon className="w-6 h-6" />
  </div>
);

const StepCard = ({ step, index, isActive, onActivate }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        relative p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer group
        ${
          isActive
            ? "border-blue-500 bg-blue-50 shadow-lg transform scale-105"
            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:-translate-y-1"
        }
      `}
      onClick={onActivate}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <StepNumber index={index} isActive={isActive} isHovered={isHovered} />
      <StepIcon Icon={step.icon} isActive={isActive} isHovered={isHovered} />

      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
        <p className="text-gray-600">{step.description}</p>
        <p
          className={`
            text-sm transition-all duration-300
            ${
              isActive
                ? "text-blue-600 opacity-100 font-medium"
                : "text-gray-500 opacity-70"
            }
          `}
        >
          {step.details}
        </p>
      </div>

      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-b-2xl" />
      )}
    </div>
  );
};

const ProcessFlow = ({ activeStep, totalSteps }) => (
  <div className="flex items-center justify-center mb-16">
    <div className="flex items-center gap-4">
      {Array.from({ length: totalSteps }, (_, index) => (
        <React.Fragment key={index}>
          <div
            className={`
              w-4 h-4 rounded-full transition-all duration-500 transform
              ${
                index <= activeStep
                  ? "bg-blue-500 scale-110 shadow-md"
                  : "bg-gray-300 scale-100"
              }
            `}
          />
          {index < totalSteps - 1 && (
            <div
              className={`
                w-16 h-0.5 transition-all duration-500
                ${index < activeStep ? "bg-blue-500" : "bg-gray-300"}
              `}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

const VideoPreview = () => (
  <div className="relative group">
    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl overflow-hidden">
      <img
        src="https://images.pexels.com/photos/176342/pexels-photo-176342.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="Construction collaboration"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
    </div>
  </div>
);

const StatCard = ({ stat }) => (
  <div className="text-center">
    <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
    <div className="text-sm text-gray-500">{stat.label}</div>
  </div>
);

// Main Component
const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It <span className="text-blue-600">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Three streamlined steps to bring your construction vision to life
          </p>
        </header>

        {/* Interactive Steps */}
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

        <ProcessFlow activeStep={activeStep} totalSteps={STEPS.length} />

        {/* Feature Highlight */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <VideoPreview />

          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              Built for <span className="text-blue-600">Success</span>
            </h3>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Our streamlined approach connects you with the right professionals
              while ensuring transparency and security throughout your project
              journey.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {STATS.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
