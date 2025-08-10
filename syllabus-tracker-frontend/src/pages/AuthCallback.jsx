import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Get the token from the URL's query parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // 2. If a token is found, save it to the browser's local storage
      localStorage.setItem('token', token);
      // 3. Redirect the user to the main dashboard page
      navigate('/');
    } else {
      // If for some reason no token is found, send the user to the login page
      navigate('/login');
    }
  }, [navigate, location]);

  // This component doesn't need to display anything, just a loading message.
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Please wait, logging you in...</p>
    </div>
  );
}