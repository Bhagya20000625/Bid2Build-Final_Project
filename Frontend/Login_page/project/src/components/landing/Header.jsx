import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "HOME", href: "#home" },
    { name: "ABOUT", href: "/about" },
    { name: "HOW IT WORKS", href: "#how-it-works" },
    { name: "SERVICES", href: "/services" },
    { name: "CONTACT", href: "#footer" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.querySelector(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleNav = (href) => {
    if (href.startsWith("#")) {
      if (location.pathname === "/") {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          setTimeout(() => {
            const delayedElement = document.querySelector(href);
            if (delayedElement) {
              delayedElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 100);
        }
        setIsMenuOpen(false);
      } else {
        navigate("/", { state: { scrollTo: href } });
        setIsMenuOpen(false);
      }
    } else {
      navigate(href);
      setIsMenuOpen(false);
    }
  };

  const handleContactUs = () => {
    if (location.pathname === "/") {
      const footer =
        document.querySelector("#footer") || document.querySelector("footer");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate("/", { state: { scrollTo: "#footer" } });
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass glow-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            onClick={() => {
              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-3 group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="text-3xl font-bold text-gradient"
            >
              Bid2Build
            </motion.div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  if (item.name === "CONTACT") {
                    handleContactUs();
                  } else {
                    handleNav(item.href);
                  }
                }}
                className="relative text-foreground/80 hover:text-foreground transition-colors duration-300 font-medium text-sm uppercase tracking-wide group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-purple transition-all duration-300 group-hover:w-full" />
              </motion.button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-sm uppercase tracking-wide"
            >
              Login
            </Button>
            <Button
              variant="gradient"
              onClick={() => navigate("/register")}
              className="text-sm uppercase tracking-wide"
            >
              Get Started
            </Button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border glass"
          >
            <div className="px-2 py-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.name === "CONTACT") {
                      handleContactUs();
                    } else {
                      handleNav(item.href);
                    }
                  }}
                  className="block w-full text-left px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-primary/10 rounded-lg transition-all duration-300 font-medium uppercase tracking-wide text-sm"
                >
                  {item.name}
                </button>
              ))}

              <div className="pt-4 space-y-2 border-t border-border mt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Login
                </Button>
                <Button
                  variant="gradient"
                  onClick={() => {
                    navigate("/register");
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;