import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { registerSchema, type RegisterInput } from '@cipher/validation';
import { generateKeyPair } from "../features/crypto/encryption";

export default function Register() {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setGlobalError('');
      
      // 1. Authenticate with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: data.displayName
      });

      // 2. Generate Cryptographic Identity (Libsodium)
      const { publicKey, privateKey } = await generateKeyPair();

      // Store the Private Key locally (NEVER send this to the server)
      localStorage.setItem('cipher_priv_key', privateKey);

      // 3. Store the Public Profile in Supabase
      const { error: dbError } = await supabase
        .from('profiles')
        .insert({
          id: user.uid,
          username: data.displayName,
          public_key: publicKey,
        });

      if (dbError) {
        throw new Error(`Database Error: ${dbError.message}`);
      }

      setIsSuccess(true);
      
      // Briefly show success state before redirecting
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setGlobalError(err.message || 'An error occurred during registration.');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Identity Secured</h2>
          <p className="text-slate-400">Cryptographic keys generated successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Initialize Node</h2>
          <p className="mt-2 text-slate-400">Establish your cryptographic identity.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {globalError && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">
              {globalError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input
                {...register('displayName')}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Display Name"
              />
              {errors.displayName && (
                <p className="mt-1 text-sm text-red-500">{errors.displayName.message}</p>
              )}
            </div>

            <div>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Email Address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                {...register('password')}
                type="password"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Secure Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Generating Keys...' : 'Secure My Identity'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Already established a node?{' '}
          <Link to="/login" className="font-medium text-indigo-500 hover:text-indigo-400">
            Establish Connection
          </Link>
        </p>
      </div>
    </div>
  );
}