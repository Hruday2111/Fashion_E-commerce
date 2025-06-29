import { useEffect } from 'react';
import { useGoogleAuth } from '../context/GoogleAuthContext';

const GoogleSignIn = ({ text = "Sign in with Google" }) => {
  const { handleGoogleSuccess, handleGoogleError, loading } = useGoogleAuth();

  useEffect(() => {
    // Load Google OAuth script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        // Use environment variable or fallback to placeholder
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
        
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleSuccess,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: '100%',
            type: 'standard',
          }
        );
      }
    };

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [handleGoogleSuccess]);

  return (
    <div className="my-4 space-y-3">
      {loading ? (
        <div className="w-full flex items-center justify-center border border-gray-300 rounded-md py-3 text-sm bg-gray-50">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
          Signing in...
        </div>
      ) : (
        <div 
          id="google-signin-button"
          className="w-full"
        ></div>
      )}
    </div>
  );
};

export default GoogleSignIn; 