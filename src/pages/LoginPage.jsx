import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Logo from '../components/Logo';

const LoginPage = () => {
  const navigate = useNavigate();
  
  // Check if user is already logged in, redirect to dashboard if they are
  React.useEffect(() => {
    const userName = localStorage.getItem('userName');
    if (userName) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 flex flex-col items-center pb-8">
            <div className="flex flex-col items-center gap-4">
              <Logo size="large" />
              <h1 className="text-2xl font-semibold tracking-tight">
                Appraisily
              </h1>
            </div>
            <div className="space-y-2 text-center">
              <CardTitle className="text-lg font-semibold tracking-tight">
                Welcome to Appraisers Dashboard
              </CardTitle>
              <CardDescription className="text-slate-600">
                Sign in to manage your appraisals
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage; 