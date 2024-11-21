import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
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
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size="small" />
          <h1 className="text-sm font-semibold">Appraisers Dashboard</h1>
        </div>

        {userName && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <User className="h-4 w-4" />
              {userName}
            </Button>

            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;