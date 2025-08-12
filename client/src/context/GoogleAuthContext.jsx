import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import API_BASE from '../config/api';

const GoogleAuthContext = createContext();

export const useGoogleAuth = () => {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProvider');
  }
  return context;
};

export const GoogleAuthProvider = ({ children }) => {
  const [googleUser, setGoogleUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/profile/google-signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setGoogleUser(result.user);
        setIsLoggedIn(true);
        alert(`Welcome ${result.user.firstName}!`);
        navigate('/');
      } else {
        alert(result.message || 'Google sign-in failed');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('An error occurred during Google sign-in. Please try again.');
    }
    setLoading(false);
  };

  const handleGoogleError = () => {
    alert('Google sign-in failed. Please try again.');
  };

  const value = {
    googleUser,
    loading,
    handleGoogleSuccess,
    handleGoogleError,
  };

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
}; 