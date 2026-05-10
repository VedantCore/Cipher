import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@cipher/validation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { generateIdentityKeys } from '../features/crypto/keys';
import { useNavigate, Link } from 'react-router-dom';

// THE FIX: Force Firebase to forget any persistent session immediately
auth.signOut().catch(console.error);

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: any) => {
    try {
      // 1. Create Firebase Auth Account
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // 2. Generate Zero-Knowledge Keys locally on your Mac
      const { publicKey, privateKey } = await generateIdentityKeys();

      // 3. SECURE STORAGE: Save Private Key locally (NEVER leaves this device)
      localStorage.setItem('cipher_priv_key', privateKey);

      // 4. Update Supabase with Public Profile and Public Key
      const { error } = await supabase.from('profiles').insert({
        id: user.uid,
        username: data.username,
        public_key: publicKey,
      });

      if (error) throw error;

      alert("Identity Secured! Redirecting to chat...");
      navigate('/chat');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl p-8 border border-white/5 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">Initialize Node</h1>
        <p className="text-slate-400 mb-8 text-sm">Generate your cryptographic identity.</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input 
              {...register('username')} 
              placeholder="Username" 
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message as string}</p>}
          </div>
          <div>
            <input 
              {...register('email')} 
              placeholder="Email" 
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message as string}</p>}
          </div>
          <div>
            <input 
              type="password" 
              {...register('password')} 
              placeholder="Master Password" 
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message as string}</p>}
          </div>
          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
          >
            Secure My Identity
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-indigo-400 text-sm hover:underline">Already have a node? Login</Link>
        </div>
      </div>
    </div>
  );
}