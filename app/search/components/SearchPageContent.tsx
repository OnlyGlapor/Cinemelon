'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDebounce } from 'use-debounce';
import { 
  Search as SearchIcon,
  Star,
  Loader2,
  X,
} from 'lucide-react';
import type { Movie } from '../../types/movie';

const SearchPageContent = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const searchMovies = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&include_adult=false`
      );
      const data = await response.json();
      
      if (data.results) {
        setMovies(data.results);
      } else {
        setError('No results found');
      }
    } catch (err) {
      setError('Failed to search movies');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    searchMovies(debouncedQuery);
  }, [debouncedQuery, searchMovies]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Search Header */}
      <div className="sticky top-16 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="relative">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for movies..."
                className="w-full bg-gray-800/50 backdrop-blur-sm text-white rounded-xl pl-12 pr-10 py-3 
                         focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                           hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-400">{error}</p>
          </div>
        ) : movies.length > 0 ? (
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                {movie.release_date && (
                  <p className="text-sm text-gray-400">
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No movies found</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400">Start typing to search for movies</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPageContent; 