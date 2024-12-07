import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Calendar, ChevronRight } from 'lucide-react';
import { Movie } from '../types/movie';

const TrendingMoviesGrid = ({ movies }: { movies: Movie[] }) => {
  const router = useRouter();
  const [touchedMovieId, setTouchedMovieId] = useState<number | null>(null);

  const handleMovieClick = (movieId: number) => {
    router.push(`/movie?id=${movieId}`);
  };

  return (
    <section className="relative mb-16 md:mb-32">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Movie Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {movies.map((movie, index) => (
            <div 
              key={movie.id}
              onClick={() => handleMovieClick(movie.id)}
              onTouchStart={() => setTouchedMovieId(movie.id)}
              onTouchEnd={() => setTouchedMovieId(null)}
              className={`group relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-800/50 
                       transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-black/50
                       cursor-pointer ${touchedMovieId === movie.id ? 'scale-[1.02]' : ''}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleMovieClick(movie.id);
                }
              }}
            >
              {/* Movie Poster */}
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                priority={index < 2} // Prioritize first two images
              />

              {/* Hover/Touch Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent 
                            transition-all duration-300
                            opacity-0 group-hover:opacity-100
                            md:translate-y-0
                            ${touchedMovieId === movie.id ? 'opacity-100' : ''}`}>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 transform translate-y-4 
                              group-hover:translate-y-0 transition-transform duration-300">
                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white line-clamp-2">
                    {movie.title}
                  </h3>

                  {/* Movie Info Badges */}
                  <div className="flex flex-wrap gap-2 mb-2 md:mb-3">
                    <span className="text-xs md:text-sm px-2 md:px-3 py-1 rounded-full bg-gray-700/50 backdrop-blur-sm text-gray-300 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                    <span className="text-xs md:text-sm px-2 md:px-3 py-1 rounded-full bg-yellow-500/10 backdrop-blur-sm text-yellow-400 flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>

                  {/* Movie Overview */}
                  <p className="text-xs md:text-sm text-gray-400 line-clamp-2 md:line-clamp-3 mb-3 md:mb-4">
                    {movie.overview}
                  </p>

                  {/* View Details Button */}
                  <button className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm
                                   rounded-lg text-xs md:text-sm text-white transition-colors duration-300
                                   flex items-center justify-center gap-2">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile Title Overlay (Always Visible) */}
              <div className="md:hidden absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
                <h3 className="text-sm font-medium text-white line-clamp-2">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-yellow-400 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                </div>
              </div>

              {/* Focus Outline - Accessibility */}
              <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-focus-visible:ring-yellow-500
                            pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingMoviesGrid;