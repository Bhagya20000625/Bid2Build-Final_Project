import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../assets/Logo1.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "/about" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Services", href: "/services" },
    { name: "Contact Us", href: "#footer" },
  ];

  // Handle scrolling to footer when navigating from other pages
  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.querySelector(location.state.scrollTo);
      if (element) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      // Clear the state to prevent repeated scrolling
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleNav = (href) => {
    if (href.startsWith("#")) {
      if (location.pathname === "/") {
        // On home page, scroll directly
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // If element not found immediately, try after a short delay
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
        // On other pages, navigate to home first then scroll
        navigate("/", { state: { scrollTo: href } });
        setIsMenuOpen(false);
      }
    } else {
      // Regular page navigation
      navigate(href);
      setIsMenuOpen(false);
    }
  };

  // Special handler for Contact Us to ensure it always works
  const handleContactUs = () => {
    if (location.pathname === "/") {
      // On home page, scroll to footer
      const footer =
        document.querySelector("#footer") || document.querySelector("footer");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // On other pages, navigate to home with footer scroll
      navigate("/", { state: { scrollTo: "#footer" } });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Background Video */}
      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src="https://videos.pexels.com/video-files/19736907/19736907-uhd_2560_1440_30fps.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <header className="fixed   bg-black/20 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                onClick={() => {
                  if (location.pathname === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    navigate("/");
                  }
                }}
              >
                <img
                  src={Logo}
                  alt="Bid2Build Logo"
                  className="h-20 w-auto object-contain cursor-pointer hover:scale-105 transition-transform duration-200"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.name === "Contact Us") {
                      handleContactUs();
                    } else {
                      handleNav(item.href);
                    }
                  }}
                  className="relative text-white/90 hover:text-white transition-colors duration-200 font-medium text-sm group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-full"></span>
                </button>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 text-white/90 hover:text-white transition-colors font-medium text-sm"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-white font-medium text-sm transition-all duration-200 hover:scale-105"
              >
                Register
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-white/90 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-white/10 bg-black/40 backdrop-blur-lg">
              <div className="px-2 py-6 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      if (item.name === "Contact Us") {
                        handleContactUs();
                      } else {
                        handleNav(item.href);
                      }
                    }}
                    className="block w-full text-left px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
                  >
                    {item.name}
                  </button>
                ))}

                <div className="pt-4 space-y-2 border-t border-white/10 mt-4">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg font-medium text-left transition-all duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-all duration-200"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
