'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Loader2, 
  Star, 
  TrendingUp,
} from 'lucide-react';
import type { Movie } from '../../types/movie';

const TrendingPageContent = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('week');
  const router = useRouter();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const data = await response.json();
        setMovies(data.results);
      } catch (err) {
        setError('Failed to fetch trending movies');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, [timeWindow]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-yellow-500 mx-auto" />
          <p className="text-gray-400 animate-pulse">Loading trending movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-gray-400 hover:text-white transition-colors underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-yellow-500" />
              <h1 className="text-2xl font-bold">Trending Movies</h1>
            </div>
            
            <select
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value as 'day' | 'week')}
              className="bg-gray-800/50 backdrop-blur-sm text-white rounded-xl px-4 py-2 hover:bg-gray-800 transition-colors"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group cursor-pointer"
              onClick={() => router.push(`/movie?id=${movie.id}`)}
            >
              <div className="aspect-[2/3] relative rounded-xl overflow-hidden bg-gray-800 shadow-lg">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <h2 className="mt-2 text-sm font-medium group-hover:text-yellow-500 transition-colors line-clamp-2">
                {movie.title}
              </h2>
              <p className="text-sm text-gray-400">
                {new Date(movie.release_date).getFullYear()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingPageContent; 