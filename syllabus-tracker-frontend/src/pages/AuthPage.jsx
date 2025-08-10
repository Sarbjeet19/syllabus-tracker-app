import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { name, email, password };
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'An unknown error occurred.');
      }
      if (isLogin) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        setMessage('Registration successful! Please log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // This function handles the Google Sign-In click
  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      {/* Bigger, Glossier Card */}
      <div className="w-full max-w-md p-10 space-y-6 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="mt-2 text-gray-300">
            {isLogin ? 'Sign in to access your dashboard' : 'Get started by creating a new account'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 mt-1 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition" required={!isLogin} />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 mt-1 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition" required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 mt-1 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition" required />
          </div>
          <div>
            <button type="submit" className="w-full px-4 py-3 font-bold text-white bg-gradient-to-r from-primary to-violet-600 rounded-lg hover:from-primary-hover hover:to-violet-700 shadow-lg hover:shadow-primary/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary-light hover:underline">
            {isLogin ? "Need an account? Sign up" : 'Already have an account? Sign In'}
          </button>
        </div>
        
        <div className="flex items-center">
          <div className="flex-grow border-t border-white/20"></div>
          <span className="mx-4 text-xs font-semibold text-gray-400">OR</span>
          <div className="flex-grow border-t border-white/20"></div>
        </div>

        {/* --- GOOGLE BUTTON (MOVED TO BOTTOM) --- */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 font-medium text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-300"
        >
          Sign in with Google
        </button>
        
        {error && <p className="text-red-400 text-center text-sm">{error}</p>}
        {message && <p className="text-green-400 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
}
