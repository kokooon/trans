import React from 'react';
import './Navbar.css';

export const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <button className="nav-button">Login</button>
      </ul>
    </nav>
  );
};

