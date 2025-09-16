import React from "react";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="footer" className="bg-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Bid2Build</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting construction professionals with clients for successful project delivery.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors block">How it Works</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors block">Services</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors block">About</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors block">Contact</a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Professionals</h3>
            <div className="space-y-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors block">Find Projects</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors block">Submit Bids</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors block">Resources</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors block">Support</a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>info@bid2build.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>New York, NY</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Bid2Build. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;