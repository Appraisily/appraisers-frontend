import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';
import Logo from './Logo';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Logo size="small" />
          <h1 className="header-title">Appraisers Dashboard</h1>
        </div>
        {userName && (
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{userName}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="logout-button"
              title="Sign out"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;