import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase'; // Adjust this path if your firebase.ts is located elsewhere

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Initialize the router navigation hook
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Authenticate with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      console.log("Login Successful! You are authenticated.");
      
      // 2. Teleport the user to the chat dashboard
      navigate('/chat');
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to authenticate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <h2 className="text-3xl font-bold text-white">Establish Connection</h2>
        
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {error && <div className="text-red-500 text-sm bg-red-950/50 p-2 rounded">{error}</div>}
          
          <div className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:border-blue-500"
              placeholder="Email address"
            />
            
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:border-blue-500"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Establish Connection'}
          </button>
        </form>

        <div className="text-sm text-slate-400 mt-4">
          Need to initialize a node? <Link to="/register" className="text-blue-500 hover:text-blue-400">Register</Link>
        </div>
      </div>
    </div>
  );
}