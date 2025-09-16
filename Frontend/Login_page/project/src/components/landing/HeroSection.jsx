import React from "react";
import { ArrowRight, Users, TrendingUp, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  
  const stats = [
    {
      icon: <Users className="w-5 h-5" />,
      value: "10K+",
      label: "Active Users",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      value: "5K+",
      label: "Projects Complete",
    },
    {
      icon: <Award className="w-5 h-5" />,
      value: "98%",
      label: "Success Rate",
    },
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://videos.pexels.com/video-files/19736907/19736907-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />

      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto text-white">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-6">
          Ready to{" "}
          <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Bid
          </span>
          ?
          <br />
          <span className="text-3xl md:text-5xl lg:text-6xl text-gray-200">
            Let's Build Together
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Discover opportunities.{" "}
          <span className="text-blue-400 font-medium">Post projects.</span>{" "}
          <span className="text-purple-400 font-medium">
            Bid competitively.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button 
            onClick={() => navigate("/register")}
            className="group relative px-6 py-3 bg-transparent rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl opacity-15 group-hover:opacity-25 transition-opacity duration-300"></div>
            <div className="absolute inset-0.5 bg-white/5 rounded-xl backdrop-blur-md"></div>
            <span className="relative z-10 flex items-center gap-2 text-white group-hover:text-cyan-200 transition-all duration-300">
              Start Building
              <div className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:rotate-45 transition-all duration-300">
                <ArrowRight className="w-3 h-3 text-white" />
              </div>
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg mb-3 text-blue-400">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white/60 text-center">
        <div className="text-sm mb-2">Scroll to explore</div>
        <div className="w-0.5 h-8 bg-white/40 mx-auto animate-pulse"></div>
      </div>
    </section>
  );
};

export default HeroSection;