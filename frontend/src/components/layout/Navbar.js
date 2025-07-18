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
    className: "home"
  },
  {
    name: 'Icon',
    route: '/',
    img: '/images/homepage-images/ohph-contest.png',
    alt: 'Community Icon',
    className: 'white-icon',
    hideInDesktop: true,
    hideInMobile: true 
  },
  {
    name: 'Login',
    route: '/login',
    img: '/images/homepage-images/navbar icons/login-button.png',
    alt: 'Login',
    className: "login"
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
      {/* Hamburger menu - appears first on mobile */}
      <div className="navbar-hamburger" onClick={toggleMobileMenu}>
        <div></div>
        <div></div>
        <div></div>        
      </div>

      {/* Desktop navigation links - filtered to exclude items with hideInDesktop */}
      <div className="navbar-links desktop">
        {navItems
          .filter(item => !item.hideInDesktop)
          .map(item => (
            <Link key={item.name} to={item.route} className="navbar-link">
              <img src={item.img} alt={item.alt} className={`navbar-icon ${item.className || ''}`} />
            </Link>
        ))}
      </div>

      {/* Company logo - appears on both but positioned differently */}
      <Link to="/" className="company-icon-link">
        <img
          src="/images/homepage-images/ohph-contest.png" 
          alt="Company Logo"
          className="company-icon"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40/333333/FFFFFF?text=Logo`; }}
        />
      </Link>

      {/*show all items and exclude the icon*/}
      {isMobileMenuOpen && (
  <div className="navbar-dropdown mobile">
    {navItems
      .filter(item => !item.hideInMobile)
      .map(item => (
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

