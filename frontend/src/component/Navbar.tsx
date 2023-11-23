import React from 'react';
import '../styles/index.css';

export const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <button className="nav-button">Login</button>
      </ul>
    </nav>
  );
};

