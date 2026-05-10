import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';

// We define a simpler schema here since Login doesn't need a username
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function Login() {
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      setServerError('');
      
      // Authenticate with Firebase
      await signInWithEmailAndPassword(auth, data.email, data.password);
      
      // In Phase 1, we will redirect to the Chat Dashboard here
      alert("Login Successful! You are authenticated.");
      
    } catch (err: any) {
      setServerError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-8 bg-slate-900 p-8 rounded-2xl border border-white/5 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white italic">CIPHER</h2>
          <p className="text-sm text-slate-400 mt-2">Access your secure node</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="p-3 text-sm text-red-400 bg-red-400/10 rounded-lg border border-red-400/20">
              {serverError}
            </div>
          )}

          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email Address"
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Password"
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading ? 'Decrypting...' : 'Establish Connection'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          No identity found? <Link to="/register" className="text-indigo-400 hover:text-indigo-300">Initialize a node</Link>
        </p>
      </div>
    </div>
  );
}