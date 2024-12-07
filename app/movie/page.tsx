'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, Clock, Star, Heart, 
  Play, Bookmark, User,
  X, Menu, Info, Video, Users
} from 'lucide-react';
import { fetchMovieDetails, fetchSimilarMovies } from '../lib/tmdb';
import { Movie } from '../types/movie';

interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string; }[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
      order: number;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      department: string;
    }[];
  };
  videos: {
    results: {
      id: string;
      key: string;
      name: string;
      type: string;
      site: string;
    }[];
  };
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  spoken_languages: {
    english_name: string;
  }[];
}

const MovieDetailsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get('id');
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'cast' | 'videos'>('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!movieId) return;
      try {
        setIsLoading(true);
        const [movieData, similarData] = await Promise.all([
          fetchMovieDetails(Number(movieId)),
          fetchSimilarMovies(Number(movieId))
        ]);
        setMovie(movieData);
        setSimilarMovies(similarData.results.slice(0, 6));
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  if (!movieId || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-yellow-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
            <p className="text-red-400 mb-4">{error || 'Movie not found'}</p>
            <button
              onClick={() => router.back()}
              className="text-sm text-gray-400 hover:text-white transition-colors underline"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const trailer = movie.videos.results.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  );

  const director = movie.credits.crew.find(
    person => person.job === 'Director'
  );

  const toggleBookmark = () => setIsBookmarked(!isBookmarked);
  const toggleFavorite = () => setIsFavorited(!isFavorited);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              {movie.overview}
            </p>
            
            {director && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6">
                <h3 className="text-lg font-semibold mb-2">Director</h3>
                <p className="text-gray-300">{director.name}</p>
              </div>
            )}

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {movie.spoken_languages.map((lang, index) => (
                  <span key={index} className="text-sm bg-gray-700/50 rounded-lg px-3 py-1">
                    {lang.english_name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'cast':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {movie.credits.cast.slice(0, 8).map((actor) => (
              <div key={actor.id} className="group cursor-pointer" onClick={() => router.push(`/cast?id=${actor.id}`)}>
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-gray-800/50">
                  {actor.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                      alt={actor.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <User className="w-10 h-10 text-gray-600" />
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-sm md:text-base group-hover:text-yellow-400 transition-colors">
                  {actor.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-400">{actor.character}</p>
              </div>
            ))}
          </div>
        );

      case 'videos':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {movie.videos.results.map((video) => (
              <div
                key={video.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => video.site === 'YouTube' && setShowTrailer(true)}
              >
                <div className="relative aspect-video">
                  <Image
                    src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                    alt={video.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
                      <Play className="w-6 h-6 text-gray-900" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium truncate">{video.name}</h3>
                  <p className="text-xs text-gray-400 capitalize">{video.type}</p>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white pb-20">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/80 to-gray-900" />
      </div>

      {/* Mobile Navigation */}
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only md:not-sr-only">Back</span>
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
              <div className="fixed inset-0 bg-black/80 z-50 md:hidden" onClick={() => setShowMobileMenu(false)}>
                <div 
                  className="absolute right-0 top-0 h-72 w-64 bg-gray-900 p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <button onClick={() => setShowMobileMenu(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        setSelectedTab('overview');
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800"
                    >
                      <Info className="w-5 h-5" />
                      Overview
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTab('cast');
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800"
                    >
                      <Users className="w-5 h-5" />
                      Cast
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTab('videos');
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800"
                    >
                      <Video className="w-5 h-5" />
                      Videos
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={toggleBookmark}
                className={`p-2 rounded-full transition-colors ${
                  isBookmarked ? 'bg-blue-500 text-white' : 'bg-gray-800/50 hover:bg-gray-800'
                }`}
              >
                <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
              <button 
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorited ? 'bg-pink-500 text-white' : 'bg-gray-800/50 hover:bg-gray-800'
                }`}
              >
                <Heart className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 pt-6 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Poster and Quick Actions */}
          <div className="lg:col-span-4">
            <div className="sticky top-20">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Mobile Quick Stats */}
              <div className="mt-4 flex items-center justify-between md:hidden">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-5 h-5" fill="currentColor" />
                    <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-5 h-5" />
                    <span>{movie.runtime}m</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleBookmark}
                    className={`p-2 rounded-full ${isBookmarked ? 'bg-blue-500 text-white' : 'text-gray-400'}`}
                  >
                    <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                  <button 
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full ${isFavorited ? 'bg-pink-500 text-white' : 'text-gray-400'}`}
                  >
                    <Heart className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 space-y-3">
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl p-4 flex items-center justify-center gap-2 transform hover:scale-102 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Watch Trailer
                  </button>
                )}
              </div>

              {/* Desktop Movie Stats */}
              <div className="hidden md:block mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Movie Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rating</span>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4" fill="currentColor" />
                      <span>{movie.vote_average.toFixed(1)}/10</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Runtime</span>
                    <span>{movie.runtime} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Release Year</span>
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* Title and Basic Info */}
              <div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                  {movie.title}
                </h1>
                <div className="flex flex-wrap gap-3">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="text-sm bg-gray-800/50 hover:bg-gray-800 backdrop-blur-sm rounded-lg px-3 py-1.5"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Desktop Tabs */}
              <div className="hidden md:block border-b border-gray-800">
                <div className="flex space-x-6">
                  {[
                    { id: 'overview', icon: Info },
                    { id: 'cast', icon: Users },
                    { id: 'videos', icon: Video }
                  ].map(({ id, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedTab(id as 'overview' | 'cast' | 'videos')}
                      className={`pb-4 px-2 capitalize font-medium transition-colors relative flex items-center gap-2 ${
                        selectedTab === id ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {id}
                      {selectedTab === id && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {renderTabContent()}
              </div>

              {/* Similar Movies */}
              {similarMovies.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-xl md:text-2xl font-semibold mb-4">Similar Movies</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {similarMovies.map((similar) => (
                      <div
                        key={similar.id}
                        className="group cursor-pointer"
                        onClick={() => router.push(`/movie?id=${similar.id}`)}
                      >
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-gray-800">
                          <Image
                            src={`https://image.tmdb.org/t/p/w300${similar.poster_path}`}
                            alt={similar.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <h3 className="font-medium text-sm md:text-base group-hover:text-yellow-400 transition-colors line-clamp-1">
                          {similar.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                          <span>{new Date(similar.release_date).getFullYear()}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span>{similar.vote_average.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setShowTrailer(false)}
        >
          <button 
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            onClick={() => setShowTrailer(false)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;