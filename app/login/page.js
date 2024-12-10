'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', email);
      router.push('/content');
    } catch (error) {
      setError('Invalid email or password');
      console.error('Error logging in:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">
      <header className="bg-transparent shadow-md py-4">
        <div className="container mx-auto flex items-center justify-between px-6">
          <h1 className="text-3xl font-bold text-white">WattPod</h1>
        </div>
      </header>

      <section className="flex flex-col items-center justify-center flex-grow text-center py-16 px-4">
        <h1 className="text-4xl font-extrabold mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg text-black">
          <div className="mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-md text-lg"
            />
          </div>
          <div className="mb-6 relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-md text-lg"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button 
            type="submit" 
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-md text-lg transition duration-300"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <div className="mt-6">
          <button onClick={() => router.push('/')} className="flex items-center text-white hover:text-pink-700">
            <FaArrowLeft className="mr-2" />
            Back to Landing Page
          </button>
        </div>
      </section>

      <footer className="bg-transparent text-white py-8 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 WattPod. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
