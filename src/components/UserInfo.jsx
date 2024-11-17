import React from 'react';
import { logout } from '../services/auth';
import './UserInfo.css';

const UserInfo = ({ userName }) => {
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (err) {
      console.error('Error during logout:', err);
      alert('Error logging out. Please try again.');
    }
  };

  return (
    <>
      <button id="logout-button" className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      {userName && (
        <div id="user-name" className="user-name">
          Logged in as {userName}
        </div>
      )}
    </>
  );
};

export default UserInfo;