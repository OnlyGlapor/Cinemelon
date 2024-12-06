"use client";

import { useEffect, useState } from 'react';
import { Film, Heart, TrendingUp, Sparkles } from "lucide-react";
import { fetchTrendingMovies } from '../lib/tmdb';
import type { Movie, Mood } from './types/movie';
import Image from 'next/image';

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBackdrop, setCurrentBackdrop] = useState<string | null>(null);

  const moods: Mood[] = [
    { 
      emoji: "😊", 
      name: "Happy", 
      gradient: "from-yellow-400 to-orange-500",
      genres: [35, 10751]
    },
    { 
      emoji: "😢", 
      name: "Sad", 
      gradient: "from-blue-400 to-blue-600",
      genres: [18]
    },
    { 
      emoji: "😴", 
      name: "Relaxed", 
      gradient: "from-green-400 to-teal-500",
      genres: [99, 36]
    },
    { 
      emoji: "🤔", 
      name: "Thoughtful", 
      gradient: "from-purple-400 to-indigo-500",
      genres: [878, 9648]
    },
    { 
      emoji: "😨", 
      name: "Thrilled", 
      gradient: "from-red-400 to-pink-500",
      genres: [27, 53]
    },
    { 
      emoji: "🥰", 
      name: "Romantic", 
      gradient: "from-pink-400 to-rose-500",
      genres: [10749]
    },
  ];

  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTrendingMovies();
        setTrendingMovies(data.results.slice(0, 3));
        
        // Set initial backdrop
        if (data.results[0]?.backdrop_path) {
          setCurrentBackdrop(data.results[0].backdrop_path);
        }
        setError(null);
      } catch (err) {
        setError('Failed to load trending movies');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrendingMovies();
  }, []);

  const handleMovieHover = (backdropPath: string) => {
    if (backdropPath) {
      setCurrentBackdrop(backdropPath);
    }
  };

  return (
    <main className="min-h-screen relative bg-gray-900">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-9">
        {currentBackdrop && (
          <Image
            src={`https://image.tmdb.org/t/p/original${currentBackdrop}`}
            alt="Movie backdrop"
            fill
            priority
            sizes="100%"
            className="object-cover opacity-20 transition-opacity duration-700"
            quality={100}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/80 to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.8)_100%)]" />
      </div>

      {/* Static Background Fallback */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" />

      {/* Hero Section */}
      <div className="relative pt-24 pb-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Cinemelon
              </h1>
            </div>
            <p className="text-2xl text-gray-300 mb-12 max-w-2xl font-light">
              Your personal movie companion. Find the perfect film that resonates with 
              your <span className="text-yellow-400">mood</span> and elevates your moment.
            </p>
            
            <button className="group bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-orange-500/25 flex items-center gap-3">
              <Film className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              Start Your Journey
              <span className="ml-1 text-yellow-200 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mood Selection */}
      <section className="relative mb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-colors">
            <h2 className="text-3xl font-semibold mb-8 text-gray-100">How are you feeling today?</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.name}
                  className={`relative group overflow-hidden rounded-2xl aspect-square bg-gradient-to-br ${mood.gradient} p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white" />
                  <div className="relative z-10 h-full flex flex-col items-center justify-center">
                    <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                      {mood.emoji}
                    </div>
                    <div className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                      {mood.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="relative mb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-3xl font-semibold text-white">Trending Now</h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse">
                  <div className="bg-gray-800/50 rounded-xl aspect-[2/3]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-red-400 bg-red-900/20 rounded-lg p-4">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trendingMovies.map((movie, index) => (
                <div 
                  key={movie.id}
                  className="group relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-800/50 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-black/50"
                  onMouseEnter={() => handleMovieHover(movie.backdrop_path)}
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-semibold mb-3 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                        {movie.title}
                      </h3>
                      <div className="flex gap-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        <span className="text-sm px-3 py-1 rounded-full bg-gray-700/50 backdrop-blur-sm text-gray-300">
                          {new Date(movie.release_date).getFullYear()}
                        </span>
                        <span className="text-sm px-3 py-1 rounded-full bg-yellow-500/10 backdrop-blur-sm text-yellow-400">
                          ⭐ {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-gray-400 line-clamp-3 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                        {movie.overview}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Collections */}
      <section className="relative pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-pink-500/10 rounded-lg">
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <h2 className="text-3xl font-semibold text-white">Featured Collections</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Oscar Winners", count: 24, gradient: "from-purple-600 to-blue-600" },
              { title: "Feel Good Movies", count: 18, gradient: "from-green-600 to-teal-600" },
              { title: "Mind Bending", count: 15, gradient: "from-red-600 to-pink-600" },
            ].map((collection) => (
              <button
                key={collection.title}
                className={`group relative overflow-hidden rounded-xl bg-gradient-to-r ${collection.gradient} p-8 h-52 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold mb-2">{collection.title}</h3>
                  <p className="text-sm text-gray-300">{collection.count} curated films</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}