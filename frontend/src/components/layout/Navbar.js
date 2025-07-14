import React from 'react';
import { Link } from 'react-router-dom';
import '../../index.css'; // Assumes global styles

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
  return (
    <nav className="navbar-container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center', // Center the content horizontally
      padding: '0.5rem 2rem',
      background: 'transparent', // Fully transparent background
      backdropFilter: 'blur(5px)', // Optional: adds a blur effect for better readability
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      position: 'relative',
      zIndex: 1000,
    }}>
      <div className="navbar-links" style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
        {navItems.map(item => (
          <Link 
            key={item.name} 
            to={item.route} 
            className="navbar-link" 
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <img 
              src={item.img} 
              alt={item.alt} 
              style={{ height: '129px', width: '129px', objectFit: 'contain' }} 
            />
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
