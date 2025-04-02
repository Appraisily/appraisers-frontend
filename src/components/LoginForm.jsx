import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, RefreshCw } from "lucide-react";
import GoogleSignIn from './GoogleSignIn';
import { login } from '../services/auth';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const [backendDetails, setBackendDetails] = useState(null);
  
  // Check if the backend is online when the component mounts
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        console.log('Checking backend health at:', backendUrl);
        
        // First try the health endpoint
        let healthResponse;
        try {
          healthResponse = await axios.get(`${backendUrl}/health`, { timeout: 5000 });
          console.log('Health check response:', healthResponse.data);
        } catch (healthErr) {
          console.log('Health endpoint not available, trying root path');
          // If health check fails, try the root path
          healthResponse = await axios.get(backendUrl, { timeout: 5000 });
        }
        
        setBackendStatus('online');
        setBackendDetails({
          url: backendUrl,
          status: healthResponse.status,
          data: healthResponse.data
        });
      } catch (err) {
        console.error('Backend health check failed:', err);
        setBackendStatus('offline');
        setBackendDetails({
          url: import.meta.env.VITE_BACKEND_URL,
          error: err.message,
          code: err.code
        });
      }
    };
    
    checkBackendStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      window.location.reload();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Display backend status indicator
  const getBackendStatusDisplay = () => {
    if (backendStatus === 'checking') {
      return (
        <div className="flex items-center gap-2 p-3 text-sm text-blue-600 bg-blue-50 rounded-lg border border-blue-200">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <p>Checking backend connectivity...</p>
        </div>
      );
    }
    
    if (backendStatus === 'offline') {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-4 w-4" />
            <p>Backend service is unavailable. Login is not possible at this time.</p>
          </div>
          <div className="p-3 text-sm text-blue-600 bg-blue-50 rounded-lg border border-blue-200">
            <p className="font-medium mb-1">Backend connection details:</p>
            <ul className="list-disc list-inside">
              <li>Backend URL: {backendDetails?.url}</li>
              <li>Error: {backendDetails?.error}</li>
              <li>Status: {backendStatus}</li>
              <li>Please contact the administrator or try again later</li>
            </ul>
          </div>
        </div>
      );
    }
    
    if (backendStatus === 'online') {
      return (
        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg border border-green-200 mb-3">
          <p>Backend service is online and ready. You can log in now.</p>
        </div>
      );
    }
    
    return null;
  };

  // Let's add specialized error details for connectivity issues
  const getErrorDisplay = () => {
    if (!error) return null;
    
    // For backend connectivity issues, add extra help
    if (error.includes('Login service not available') || error.includes('Network Error') || error.includes('Not Found')) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
          <div className="p-3 text-sm text-blue-600 bg-blue-50 rounded-lg border border-blue-200">
            <p className="font-medium mb-1">Troubleshooting tips:</p>
            <ul className="list-disc list-inside">
              <li>Check if the backend service is running properly</li>
              <li>Current backend URL: {import.meta.env.VITE_BACKEND_URL}</li>
              <li>Backend status: {backendStatus}</li>
              <li>Try refreshing the page</li>
              <li>Make sure your internet connection is active</li>
            </ul>
          </div>
        </div>
      );
    }
    
    // Standard error display
    return (
      <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle className="h-4 w-4" />
        <p>{error}</p>
      </div>
    );
  };

  return (
    <div className="grid gap-6">
      {getBackendStatusDisplay()}
      <form onSubmit={handleSubmit} className="space-y-4">
        {getErrorDisplay()}

        <div className="space-y-2">
          <Label htmlFor="email">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            autoComplete="email"
            disabled={isLoading}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={isLoading}
            className="h-11"
          />
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-11 text-base font-semibold"
        >
          {isLoading ? "Signing in..." : "Sign in with Email"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleSignIn />
    </div>
  );
};

export default LoginForm;