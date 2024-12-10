'use client';

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig'; 
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { FaStar, FaSearch, FaHeart, FaRegHeart, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const ContentPage = () => {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [notified, setNotified] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'books'));
        const booksList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBooks(booksList);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchBooks();
        fetchFavorites(currentUser.uid);
        fetchNotified(currentUser.uid);
      } else {
        router.push('/'); 
      }
    });

    return () => unsubscribe();
  }, [router]);

  
  const fetchFavorites = async (userId) => {
    const favoritesRef = collection(db, 'favorites');
    const querySnapshot = await getDocs(favoritesRef);
    const userFavorites = querySnapshot.docs.map((doc) => doc.data().bookId);
    setFavorites(userFavorites);
  };

  
  const fetchNotified = async (userId) => {
    const notifiedRef = collection(db, 'notified');
    const querySnapshot = await getDocs(notifiedRef);
    const userNotified = querySnapshot.docs.map((doc) => doc.data().bookId);
    setNotified(userNotified);
  };

  
  const handleFavorite = async (book) => {
    if (!user) {
      console.log('User not authenticated');
      return;
    }

    const favoriteRef = collection(db, 'favorites');

    
    const favoriteDoc = await getDocs(favoriteRef);
    const existingFavorite = favoriteDoc.docs.find((doc) => doc.data().bookId === book.id);

    if (existingFavorite) {
      
      await deleteDoc(doc(favoriteRef, existingFavorite.id));
      setFavorites(favorites.filter((id) => id !== book.id));
    } else {
      
      await setDoc(doc(favoriteRef), {
        bookId: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre,
      });
      setFavorites((prev) => [...prev, book.id]);
    }
  };

  
  const handleNotify = async (book) => {
    if (!user) {
      console.log('User not authenticated');
      return;
    }

    const notifiedRef = collection(db, 'notified');
    const existingNotified = notified.includes(book.id);

    if (existingNotified) {
      
      const notifiedDoc = await getDocs(notifiedRef);
      const docToRemove = notifiedDoc.docs.find((doc) => doc.data().bookId === book.id);
      await deleteDoc(doc(notifiedRef, docToRemove.id)); 

      
      setNotified((prev) => prev.filter((id) => id !== book.id));
    } else {
      
      await setDoc(doc(notifiedRef), {
        bookId: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre,
      });

      
      setNotified((prev) => [...prev, book.id]);
    }
  };

  
  const filteredBooks = books.filter((book) => {
    const matchesSearchTerm = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter ? book.genre === genreFilter : true;
    return matchesSearchTerm && matchesGenre;
  });

  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 text-gray-900">
      
      <header className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 shadow-md py-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">WattPod</h1>
          <nav className="space-x-8 flex items-center">
            <button onClick={handleLogout} className="text-white hover:text-pink-600 text-lg flex items-center">
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </nav>
        </div>

        <div className="py-4 px-6">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
            
            <div className="relative w-full md:w-1/2">
              <FaSearch className="absolute top-3 left-3 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search books..."
                className="w-full py-2 pl-10 pr-4 border rounded-md text-gray-700"
              />
            </div>

            
            <div className="w-full md:w-1/3 mt-4 md:mt-0">
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="w-full py-2 px-4 border rounded-md text-gray-700"
              >
                <option value="">All Genres</option>
                <option value="Romance">Romance</option>
                <option value="Historical Fiction">Historical Fiction</option>
                <option value="Drama">Drama</option>
                <option value="Non-fiction">Non-fiction</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Fantasy">Fantasy</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      
      <section className="container mx-auto p-6">
        <h2 className="text-3xl text-center mb-8 text-white">Explore Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.length === 0 ? (
            <p className="text-center col-span-full text-white">No books found.</p>
          ) : (
            filteredBooks.map((book, index) => {
              const gradientColors = [
                'from-red-400 via-yellow-400 to-orange-500',
                'from-blue-400 via-purple-400 to-indigo-500',
                'from-green-400 via-teal-400 to-blue-500',
                'from-pink-400 via-purple-400 to-indigo-500',
                'from-indigo-500 via-purple-500 to-pink-600',
                'from-yellow-400 via-orange-400 to-red-500'
              ];

              return (
                <div
                  key={book.id}
                  className={`bg-gradient-to-r ${gradientColors[index % gradientColors.length]} p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col`}
                >
                  <h3 className="text-xl font-semibold text-white">{book.title}</h3>
                  <p className="text-sm text-gray-200">Author: {book.author}</p>
                  <p className="text-sm text-gray-200">Genre: {book.genre}</p>

                  
                  {book.imageUrl && (
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="w-full h-48 object-contain my-4 rounded-md"
                    />
                  )}

                  <p className="text-gray-200 text-sm mb-4">{book.description}</p>

                  <div className="flex justify-between items-center mt-auto">
                    <button
                      className={`flex items-center space-x-2 py-2 px-4 rounded-md text-white ${
                        favorites.includes(book.id)
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-gray-500 hover:bg-gray-600'
                      }`}
                      onClick={() => handleFavorite(book)}
                    >
                      {favorites.includes(book.id) ? <FaHeart /> : <FaRegHeart />}
                      {favorites.includes(book.id) ? 'Favorited' : 'Add to Favorites'}
                    </button>

                    <button
                      className={`flex items-center space-x-2 py-2 px-4 rounded-md text-white ${
                        notified.includes(book.id)
                          ? 'bg-yellow-500 hover:bg-yellow-600'
                          : 'bg-gray-500 hover:bg-gray-600'
                      }`}
                      onClick={() => handleNotify(book)}
                    >
                      <FaBell />
                      {notified.includes(book.id) ? 'Notified' : 'Notify Me'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default ContentPage;
