import React from "react";
import Logo from "../assets/Logo1.jpg"; // Importing the Logo image
import {
  Linkedin,
  Youtube,
  Instagram,
  Twitter,
  Mail,
  Building2
} from "lucide-react";

const Footer = () => {
  return (
    <footer id="footer" className="relative bg-gray-500 text-gray-100 overflow-hidden">
      {/* Refined geometric pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(249,115,22,0.08) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(249,115,22,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px, 30px 30px'
          }}
        />
      </div>
           
      <div className="relative px-6 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
           <div className="flex items-center space-x-3">
  <div className="w-auto h-12 bg-gradient-to-br rounded-3xl flex items-center justify-center shadow-lg overflow-hidden">
    <img
  src={Logo}
  alt="Logo"
  className="h-12 w-auto object-contain cursor-pointer" />
   </div>
</div>
                        
            <p className="text-gray-200 leading-relaxed">
              Innovative construction marketplace connecting verified professionals through cutting-edge technology.
            </p>
          </div>
                   
          {/* Contact & Links */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Get in Touch</h3>
              <div className="flex items-center space-x-3 text-gray-200">
                <Mail className="w-4 h-4 text-orange-400" />
                <a
                  href="mailto:bid2build05@gmail.com"
                  className="hover:text-orange-400 transition-colors"
                >
                  bid2build05@gmail.com
                </a>
              </div>
              <p className="text-sm text-gray-300">Drop us a message</p>
            </div>
                       
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Quick Links</h3>
              <nav className="grid grid-cols-2 gap-2">
                {['About', 'Services', 'HowItWorks'].map((item) => (
                  <a key={item} href="#" className="text-gray-200 hover:text-orange-400 transition-colors text-sm">
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
                 
        {/* Bottom Bar */}
        <div className="border-t border-gray-400 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Bid2Build. Built with innovation.
          </p>
                   
          <div className="flex space-x-3">
            {[Linkedin, Youtube, Instagram, Twitter].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="w-9 h-9 bg-gray-600 border border-gray-500 rounded-lg flex items-center justify-center text-gray-200 hover:text-orange-400 hover:bg-gray-700 hover:border-orange-400 transition-all duration-200 shadow-sm"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
           
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent" />
    </footer>
  );
};

export default Footer;