'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  Loader2, 
  Star, 
  Calendar, 
  TrendingUp,
  Heart,
  ThumbsUp,
  ArrowRight,
  Filter,
  X,
  ChevronLeft
} from 'lucide-react';
import { fetchMovieRecommendations, fetchMoviesByMood } from '../../lib/tmdb';
import type { Movie } from '../../types/movie';

// Define the Mood type explicitly here to match the one from the API
type Mood = 'Happy' | 'Sad' | 'Relaxed' | 'Thoughtful' | 'Thrilled' | 'Romantic';

// Type guard to check if a string is a valid Mood
const isMood = (value: string | null): value is Mood => {
  const validMoods: Mood[] = ['Happy', 'Sad', 'Relaxed', 'Thoughtful', 'Thrilled', 'Romantic'];
  return value !== null && validMoods.includes(value as Mood);
};

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

const MovieCard = ({ movie, onSelect }: MovieCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    router.push(`/movie?id=${movie.id}`);
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-xl bg-gray-800/50 aspect-[2/3] 
                transform transition-all duration-500 hover:scale-102 cursor-pointer"
      onClick={handleClick}
      onMouseEnter={() => onSelect(movie)}
    >
      {/* Enhanced Mobile Touch Feedback */}
      <div className="absolute inset-0 bg-black opacity-0 group-active:opacity-20 md:group-hover:opacity-10 
                    transition-opacity duration-200 z-10" />
      
      {/* Movie Poster with Optimized Loading */}
      <div className={`relative w-full h-full ${!imageLoaded ? 'animate-pulse bg-gray-700' : ''}`}>
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          className={`object-cover transition-opacity duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoadingComplete={() => setImageLoaded(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={imageLoaded ? false : true}
        />
      </div>

      {/* Mobile-Optimized Content Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/80 to-transparent 
                    opacity-0 group-hover:opacity-100 md:transition-all md:duration-300
                    touch:opacity-100 md:touch:opacity-0">
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white line-clamp-2">
            {movie.title}
          </h3>

          <div className="flex flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 backdrop-blur-sm
                          rounded-full px-2 py-1 text-sm">
              <Star className="w-3 h-3 md:w-4 md:h-4" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-300 bg-gray-700/50 backdrop-blur-sm
                          rounded-full px-2 py-1 text-sm">
              <Calendar className="w-3 h-3 md:w-4 md:h-4" />
              <span>{new Date(movie.release_date).getFullYear()}</span>
            </div>
          </div>

          <p className="hidden md:block text-sm text-gray-300 line-clamp-3 mb-4">
            {movie.overview}
          </p>

          <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 
                          font-semibold rounded-lg py-2 px-4 flex items-center justify-center gap-2 
                          text-sm md:text-base active:scale-95 transition-transform">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface MobileHeaderProps {
  mood: string | null;
  onBack: () => void;
}

const MobileHeader = ({ mood, onBack }: MobileHeaderProps) => (
  <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50">
    <div className="px-4 py-4 md:py-6 flex items-center gap-4">
      <button
        onClick={onBack}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800/50 
                 text-gray-400 hover:text-white active:scale-95 transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      {mood ? (
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getEmoji(mood)}</span>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 
                       bg-clip-text text-transparent">
            {mood} Movies
          </h1>
        </div>
      ) : (
        <h1 className="text-lg font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 
                     bg-clip-text text-transparent">
          Recommended Movies
        </h1>
      )}
    </div>
  </header>
);

const getEmoji = (mood: string): string => {
  const emojiMap: Record<string, string> = {
    Happy: '😊',
    Sad: '😢',
    Relaxed: '😌',
    Thoughtful: '🤔',
    Thrilled: '😨',
    Romantic: '🥰'
  };
  return emojiMap[mood] || '🎬';
};

const RecommendationsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moodParam = searchParams.get('mood');
  const movieId = searchParams.get('movieId');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        let data;
        if (movieId) {
          data = await fetchMovieRecommendations(Number(movieId));
        } else if (moodParam && isMood(moodParam)) {
          data = await fetchMoviesByMood(moodParam);
        } else {
          throw new Error('No valid mood or movie ID specified');
        }
        
        if (!data.results?.length) {
          throw new Error('No recommendations found');
        }
        
        setMovies(data.results);
        setSelectedMovie(data.results[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [movieId, moodParam]);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {selectedMovie?.backdrop_path && (
        <div className="fixed inset-0 -z-10">
          <Image
            src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`}
            alt="Background"
            fill
            className="object-cover opacity-10 transform scale-105 transition-transform duration-1000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/80 to-gray-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.8)_100%)]" />
        </div>
      )}

      <MobileHeader mood={moodParam} onBack={() => router.push('/')} />

      <main className="relative z-10">
        <div className="px-4 md:px-6 py-6 md:py-12 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 md:py-32">
              <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 animate-spin mb-4" />
              <p className="text-lg md:text-xl text-gray-400 animate-pulse">
                Finding the perfect movies for you...
              </p>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto text-center py-12">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 md:p-8">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => router.push('/')}
                  className="text-sm text-gray-400 hover:text-white transition-colors underline"
                >
                  Try selecting a different mood
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {movies.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    onSelect={setSelectedMovie}
                  />
                ))}
              </div>

              <div className="mt-12 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { 
                    icon: <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />,
                    label: 'Trending Movies',
                    value: movies.length
                  },
                  { 
                    icon: <Heart className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />,
                    label: 'Average Rating',
                    value: `${(movies.reduce((acc, movie) => acc + movie.vote_average, 0) / movies.length).toFixed(1)} / 10`
                  },
                  { 
                    icon: <ThumbsUp className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />,
                    label: 'Match Score',
                    value: '94%'
                  }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 flex items-center gap-3 
                            transform hover:scale-102 transition-all duration-300"
                  >
                    <div className="p-2 md:p-3 bg-gray-700/50 rounded-lg">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-400">{stat.label}</p>
                      <p className="text-lg md:text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <button
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg 
                 bg-yellow-500 text-gray-900 transform active:scale-95 transition-transform"
      >
        {showFilters ? <X className="w-6 h-6" /> : <Filter className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default RecommendationsPage;