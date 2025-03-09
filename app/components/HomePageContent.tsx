'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  TrendingUp, 
  Star, 
  Play,
  Calendar,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import type { Movie } from '../types/movie';

// Add mood options
const moodOptions = [
  { emoji: "😊", mood: "Happy", color: "bg-yellow-500/10" },
  { emoji: "😢", mood: "Sad", color: "bg-blue-500/10" },
  { emoji: "😨", mood: "Scared", color: "bg-purple-500/10" },
  { emoji: "😎", mood: "Cool", color: "bg-green-500/10" },
  { emoji: "🤔", mood: "Thoughtful", color: "bg-orange-500/10" },
  { emoji: "😂", mood: "Funny", color: "bg-pink-500/10" },
];

// Skeleton components
const SkeletonHero = () => (
  <div className="relative h-[85vh] overflow-hidden bg-gray-800 animate-pulse">
    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 space-y-6">
      <div className="h-12 md:h-16 bg-gray-700 rounded-lg w-3/4 max-w-4xl"></div>
      
      <div className="flex flex-wrap items-center gap-4">
        <div className="h-6 w-24 bg-gray-700 rounded-full"></div>
        <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
      </div>
      
      <div className="max-w-2xl space-y-2">
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded w-4/6"></div>
      </div>

      <div className="h-12 w-36 bg-gray-700 rounded-xl"></div>
    </div>
  </div>
);

const SkeletonMoodCard = () => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center animate-pulse">
    <div className="h-12 w-12 bg-gray-700 rounded-full mx-auto mb-3"></div>
    <div className="h-4 w-16 bg-gray-700 rounded mx-auto"></div>
  </div>
);

const SkeletonMovieCard = () => (
  <div className="animate-pulse">
    <div className="aspect-[2/3] relative rounded-xl overflow-hidden bg-gray-800 shadow-lg"></div>
    <div className="mt-2 h-4 bg-gray-800 rounded w-5/6"></div>
    <div className="mt-1 h-4 bg-gray-800 rounded w-1/4"></div>
  </div>
);

const HomePageContent = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [nowPlayingRes, trendingRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`),
          fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`)
        ]);

        const [nowPlayingData, trendingData] = await Promise.all([
          nowPlayingRes.json(),
          trendingRes.json()
        ]);

        setFeaturedMovies(nowPlayingData.results.slice(0, 5));
        setTrendingMovies(trendingData.results.slice(0, 10));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      {isLoading ? (
        <SkeletonHero />
      ) : (
        <div className="relative h-[85vh] overflow-hidden">
          {featuredMovies[0] && (
            <>
              <Image
                src={`https://image.tmdb.org/t/p/original${featuredMovies[0].backdrop_path}`}
                alt={featuredMovies[0].title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50" />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold max-w-4xl leading-tight">
                  {featuredMovies[0].title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                    <span>{featuredMovies[0].vote_average.toFixed(1)} Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(featuredMovies[0].release_date).getFullYear()}</span>
                  </div>
                </div>
                
                <p className="max-w-2xl text-gray-300 line-clamp-3">
                  {featuredMovies[0].overview}
                </p>

                <button
                  onClick={() => router.push(`/movie?id=${featuredMovies[0].id}`)}
                  className="flex items-center gap-2 bg-yellow-500 text-gray-900 px-6 py-3 rounded-xl
                           font-medium hover:bg-yellow-400 transform active:scale-95 transition-all"
                >
                  <Play className="w-5 h-5" fill="currentColor" />
                  Watch Now
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Mood Section */}
      <section className="py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">What&apos;s Your Mood?</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {isLoading ? (
              // Skeleton loaders for mood cards
              [...Array(6)].map((_, index) => (
                <SkeletonMoodCard key={index} />
              ))
            ) : (
              moodOptions.map(({ emoji, mood, color }) => (
                <button
                  key={mood}
                  onClick={() => router.push(`/recommendations?mood=${encodeURIComponent(mood)}`)}
                  className={`${color} backdrop-blur-sm rounded-xl p-6 text-center hover:ring-2 
                           ring-white/20 transition-all duration-300 group`}
                >
                  <span className="text-4xl mb-3 block transform group-hover:scale-110 transition-transform">
                    {emoji}
                  </span>
                  <span className="font-medium text-sm text-gray-300 group-hover:text-white transition-colors">
                    {mood}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold">Trending Now</h2>
            </div>
            <button
              onClick={() => router.push('/trending')}
              className="flex items-center gap-1 text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {isLoading ? (
              // Skeleton loaders for movie cards
              [...Array(10)].map((_, index) => (
                <SkeletonMovieCard key={index} />
              ))
            ) : (
              trendingMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/movie?id=${movie.id}`)}
                >
                  <div className="aspect-[2/3] relative rounded-xl overflow-hidden bg-gray-800 shadow-lg">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
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
                  <p className="text-sm text-gray-400">
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageContent;