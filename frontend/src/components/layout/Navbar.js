import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const navItems = [
  {
    name: 'Home',
    route: '/',
    img: '/images/homepage-images/navbar icons/home-button.png',
    alt: 'Home',
  },
  {
    name: 'Hbada',
    route: '/hbada-synergy',
    img: '/images/homepage-images/navbar icons/hbada-button.png',
    alt: 'Hbada',
  },
  {
    name: 'Login',
    route: '/login',
    img: '/images/homepage-images/navbar icons/login-button.png',
    alt: 'Login',
  },
  {
    name: 'Signup',
    route: '/signup',
    img: '/images/homepage-images/navbar icons/signup-button.png',
    alt: 'Signup',
  },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-links desktop">
        {navItems.map(item => (
          <Link 
            key={item.name} 
            to={item.route} 
            className="navbar-link"
          >
            <img 
              src={item.img} 
              alt={item.alt} 
              className="navbar-icon"
            />
          </Link>
        ))}
      </div>
      <div className="navbar-hamburger" onClick={toggleMobileMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {isMobileMenuOpen && (
        <div className="navbar-dropdown mobile">
          {navItems.map(item => (
            <Link 
              key={item.name} 
              to={item.route} 
              className="navbar-link"
              onClick={toggleMobileMenu}
            >
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
