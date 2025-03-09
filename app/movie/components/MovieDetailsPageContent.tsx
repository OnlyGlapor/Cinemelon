'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, Star, Heart, 
  Play, User,
  X, Video
} from 'lucide-react';
import { fetchMovieDetails, fetchSimilarMovies, getWatchProviders } from '../../lib/tmdb';
import { Movie } from '../../types/movie';

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

interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface WatchProviders {
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

const MovieDetailsPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get('id');
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showTrailer, setShowTrailer] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [watchProviders, setWatchProviders] = useState<WatchProviders | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!movieId) return;
      try {
        setIsLoading(true);
        const [movieData, similarData, providers] = await Promise.all([
          fetchMovieDetails(Number(movieId)),
          fetchSimilarMovies(Number(movieId)),
          getWatchProviders(Number(movieId))
        ]);
        setMovie(movieData);
        setSimilarMovies(similarData.results.slice(0, 6));
        setWatchProviders(providers.results?.US || null);
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

  const toggleFavorite = () => setIsFavorited(!isFavorited);

  const handleWatch = async () => {
    try {
      setIsWatching(true);
    } catch (error) {
      console.error('Streaming error:', error);
      alert('Failed to load stream');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleActorClick = (actorId: number) => {
    router.push(`/cast?id=${actorId}`);
  };

  const WatchOptions = () => (
    <div className="space-y-3">
      {watchProviders && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
          <h3 className="font-semibold mb-3">Where to Watch</h3>
          {watchProviders.flatrate && (
            <div className="mb-3">
              <p className="text-sm text-gray-400 mb-2">Streaming</p>
              <div className="flex gap-2">
                {watchProviders.flatrate.map((provider: WatchProvider) => (
                  <Image
                    width={500}
                    height={500}
                    key={provider.provider_id}
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                    alt={provider.provider_name}
                    className="w-8 h-8 rounded-lg"
                    title={provider.provider_name}
                  />
                ))}
              </div>
            </div>
          )}
          {watchProviders.rent && (
            <div className="mb-3">
              <p className="text-sm text-gray-400 mb-2">Rent</p>
              <div className="flex gap-2">
                {watchProviders.rent.map((provider: WatchProvider) => (
                  <Image
                  width={500}
                  height={500}
                    key={provider.provider_id}
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                    alt={provider.provider_name}
                    className="w-8 h-8 rounded-lg"
                    title={provider.provider_name}
                  />
                ))}
              </div>
          </div>
          )}
          {watchProviders.buy && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Buy</p>
              <div className="flex gap-2">
                {watchProviders.buy.map((provider: WatchProvider) => (
                  <Image
                  width={500}
                  height={500}
                    key={provider.provider_id}
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                    alt={provider.provider_name}
                    className="w-8 h-8 rounded-lg"
                    title={provider.provider_name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
          </div>
        );

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Update Back Button */}
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 z-40 p-2 bg-gray-900/90 backdrop-blur-sm hover:bg-gray-800 rounded-full transition-all duration-300 group"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
      </button>

      {/* Hero Section */}
      <div className="relative h-[70vh] lg:h-[85vh] w-full">
        {/* Backdrop */}
        <div className="absolute inset-0">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
            className="object-cover"
          priority
        />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/10 via-gray-900/60 to-gray-900" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 w-full p-6 md:p-12 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold max-w-4xl leading-tight">
            {movie.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
            <span className="bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-full">
              {new Date(movie.release_date).getFullYear()}
            </span>
            <span className="bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-full">
              {movie.runtime} min
            </span>
            {movie.genres.map(genre => (
              <span key={genre.id} className="bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-full">
                {genre.name}
              </span>
            ))}
      </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={handleWatch}
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Watch Now
            </button>
            {trailer && (
            <button 
                onClick={() => setShowTrailer(true)}
                className="bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800 px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all"
              >
                <Video className="w-5 h-5" />
                Trailer
              </button>
            )}
              <button 
                onClick={toggleFavorite}
              className={`p-4 rounded-xl transition-all ${
                isFavorited 
                  ? 'bg-pink-500 text-white' 
                  : 'bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800'
                }`}
              >
                <Heart className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Overview & Cast */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>

            {/* Cast Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {movie.credits.cast.slice(0, 8).map((person) => (
                  <div 
                    key={person.id} 
                    className="group cursor-pointer" 
                    onClick={() => handleActorClick(person.id)}
                  >
                    <div className="aspect-[2/3] relative rounded-xl overflow-hidden bg-gray-800">
                      {person.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                          alt={person.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <User className="w-1/3 h-1/3 text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-sm font-medium text-white text-center px-2">
                            View Profile
                          </p>
                        </div>
                      </div>
                    </div>
                    <h3 className="mt-2 font-medium text-sm group-hover:text-yellow-500 transition-colors">
                      {person.name}
                    </h3>
                    <p className="text-sm text-gray-400">{person.character}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Watch Options & Similar Movies */}
          <div className="space-y-8">
            <WatchOptions />

              {/* Similar Movies */}
              {similarMovies.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">More Like This</h2>
                <div className="space-y-4">
                    {similarMovies.map((similar) => (
                      <div
                        key={similar.id}
                        onClick={() => router.push(`/movie?id=${similar.id}`)}
                      className="flex gap-4 cursor-pointer group"
                      >
                      <div className="relative w-24 h-36 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                          src={`https://image.tmdb.org/t/p/w200${similar.poster_path}`}
                            alt={similar.title}
                            fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      <div className="flex-1">
                        <h3 className="font-medium group-hover:text-yellow-500 transition-colors">
                          {similar.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                          <span>{similar.vote_average.toFixed(1)}</span>
                          <span>•</span>
                          <span>{new Date(similar.release_date).getFullYear()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
              )}
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

      {isWatching && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setIsWatching(false)}
        >
          <button 
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            onClick={() => setIsWatching(false)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden">
            <iframe
              src={`https://multiembed.mov/directstream.php?video_id=${movie.id}&tmdb=1`}
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPageContent;