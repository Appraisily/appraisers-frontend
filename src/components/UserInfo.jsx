import React from 'react';
import { logout } from '../services/auth';
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

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

  if (!userName) return null;

  return (
    <div className="fixed top-4 right-4 flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm"
        className="bg-white/50 backdrop-blur-sm shadow-sm"
      >
        <User className="h-4 w-4 mr-2" />
        {userName}
      </Button>

      <Button 
        variant="destructive" 
        size="sm"
        className="shadow-sm"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign out
      </Button>
    </div>
  );
};

export default UserInfo;