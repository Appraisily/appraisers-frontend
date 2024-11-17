import React, { useEffect } from 'react';
import { ENDPOINTS } from '../config/endpoints';
import './GoogleSignIn.css';

const GoogleSignIn = () => {
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (!window.google || !window.google.accounts) {
        setTimeout(initializeGoogleSignIn, 100);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: '856401495068-ica4bncmu5t8i0muugrn9t8t25nt1hb4.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        auto_prompt: false
      });

      window.google.accounts.id.renderButton(
        document.getElementById('g_id_signin'),
        {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'rectangular',
          text: 'continue_with',
          logo_alignment: 'center',
          width: '300'
        }
      );
    };

    initializeGoogleSignIn();
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const result = await fetch(ENDPOINTS.AUTH.GOOGLE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          credential: response.credential
        })
      });

      const data = await result.json();

      if (data.success) {
        localStorage.setItem('userName', data.name);
        window.location.reload();
      } else {
        throw new Error(data.message || 'Google authentication failed');
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      alert(error.message || 'Failed to authenticate with Google');
    }
  };

  return (
    <div className="google-signin-container">
      <div id="g_id_signin"></div>
    </div>
  );
};

export default GoogleSignIn;