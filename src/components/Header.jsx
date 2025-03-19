import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';
import { Button } from "@/components/ui/button";
import { User, LogOut, Home, Settings } from "lucide-react";
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

  const handleHome = () => {
    navigate('/dashboard');
  };

  return (
    <header className="header border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-subtle">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size="small" />
          <div>
            <h1 className="text-sm font-semibold text-primary">Appraisers Dashboard</h1>
            <p className="text-xs text-muted-foreground">Art Valuation System</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleHome}
            className="text-foreground/70 hover:text-foreground"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Button>

          {userName && (
            <>
              <div className="h-5 w-px bg-border/50 mx-1"></div>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="text-foreground/70 hover:text-foreground gap-2"
              >
                <User className="h-4 w-4" />
                {userName}
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="text-destructive border-destructive/20 hover:bg-destructive/10 gap-1"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;