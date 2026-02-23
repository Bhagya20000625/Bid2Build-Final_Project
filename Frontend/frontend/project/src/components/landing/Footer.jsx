import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Facebook,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

const Footer = () => {
  const quickLinks = [
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '#footer' },
  ];

  const professionalLinks = [
    { name: 'Find Projects', href: '#' },
    { name: 'Submit Bids', href: '#' },
    { name: 'Resources', href: '#' },
    { name: 'Support', href: '#' },
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer id="footer" className="relative border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-purple rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">Bid2Build</span>
            </div>
            <p className="text-foreground/60 mb-6 leading-relaxed">
              Connecting construction professionals with clients for successful
              project delivery.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 glass glow-border rounded-lg flex items-center justify-center text-foreground/60 hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">
              Quick Links
            </h3>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-foreground/60 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* For Professionals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">
              For Professionals
            </h3>
            <div className="space-y-3">
              {professionalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-foreground/60 hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-foreground/60">
                <div className="w-9 h-9 glass rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">info@bid2build.com</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/60">
                <div className="w-9 h-9 glass rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/60">
                <div className="w-9 h-9 glass rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">New York, NY</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-border pt-8 text-center"
        >
          <p className="text-foreground/40 text-sm">
            &copy; 2024 Bid2Build. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;