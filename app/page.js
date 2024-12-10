'use client';

import React from 'react';
import { FaBookOpen, FaArrowRight, FaSignInAlt, FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">
      <header className="bg-gray shadow-md py-4">
        <div className="container mx-auto flex items-center justify-between px-6">
          <h1 className="text-3xl font-bold text-white-600">WattPod</h1>
          <nav className="space-x-8 flex items-center">
            <a href="#" className="text-white hover:text-pink-600">
              <FaHome className="text-2xl" />
            </a>
          </nav>
        </div>
      </header>

      <section className="flex flex-col items-center justify-center flex-grow bg-gradient-to-r from-whitew-500 via-purple-500 to-indigo-500 text-white text-center py-16 px-4 relative">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-4">Welcome to WattPod</h1>
          <p className="text-xl mb-6 max-w-lg mx-auto">Dive into a world of endless stories and incredible authors. Explore, read, and share your thoughts.</p>
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => router.push('/signup')}
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full text-lg flex items-center justify-center transition duration-300"
            >
              Get Started <FaArrowRight className="ml-2" />
            </button>
            <button
              onClick={() => router.push('/login')}
              className="bg-gray-800 text-white hover:bg-gray-700 px-8 py-3 rounded-full text-lg flex items-center justify-center transition duration-300"
            >
              Login <FaSignInAlt className="ml-2" />
            </button>
          </div>
          <div className="flex justify-center space-x-8 mt-10">
            <div className="text-center">
              <FaBookOpen className="text-6xl text-white mb-4" />
              <p className="text-xl">Discover Books</p>
            </div>
            <div className="text-center">
              <FaArrowRight className="text-6xl text-white mb-4 animate-bounce" />
              <p className="text-xl">Read Anytime</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 WattPod. All Rights Reserved.</p>
          <div className="mt-4">
            <a href="#" className="text-pink-400 hover:text-pink-600 mx-3">Privacy Policy</a>
            <a href="#" className="text-pink-400 hover:text-pink-600 mx-3">Terms of Service</a>
            <a href="#" className="text-pink-400 hover:text-pink-600 mx-3">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
