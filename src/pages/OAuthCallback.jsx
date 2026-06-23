import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { oauthLogin } from '../api/authApi';
import { toast } from 'react-toastify';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  
  // Use a ref to prevent strict mode from triggering double API calls
  const processed = useRef(false);

  useEffect(() => {
    const processCallback = async () => {
      if (processed.current) return;
      
      const searchParams = new URLSearchParams(location.search);
      const hashParams = new URLSearchParams(location.hash.substring(1));
      
      const provider = location.pathname.split('/').pop();
      let token = null;
      let returnedState = null;

      if (provider.toLowerCase() === 'github') {
        token = searchParams.get('code');
        returnedState = searchParams.get('state');
      } else if (provider.toLowerCase() === 'facebook') {
        token = hashParams.get('access_token') || searchParams.get('code');
        returnedState = hashParams.get('state') || searchParams.get('state');
      }

      const savedState = sessionStorage.getItem('oauth_state');
      sessionStorage.removeItem('oauth_state');

      if (savedState && returnedState !== savedState) {
        setError('Security error: CSRF state mismatch. Request rejected.');
        processed.current = true;
        return;
      }

      if (!token) {
        setError('No authorization token found in the callback url.');
        processed.current = true;
        return;
      }

      processed.current = true;
      try {
        const response = await oauthLogin(
          provider.charAt(0).toUpperCase() + provider.slice(1).toLowerCase(), 
          token
        );
        
        login(response.accessToken, response.refreshToken);
        toast.success(`Successfully logged in via ${provider}!`);
        navigate('/');
      } catch (err) {
        console.error('OAuth login failed:', err);
        setError(err.response?.data?.message || 'OAuth login failed');
        toast.error('OAuth login failed. Please try again.');
      }
    };

    processCallback();
  }, [location, login, navigate]);

  if (error) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "80vh" }}>
        <h2 className="text-danger mb-4">Authentication Failed</h2>
        <p className="text-muted mb-4">{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
        <h4 className="text-muted">Authenticating...</h4>
        <p className="text-muted small">Please wait while we complete your login.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
