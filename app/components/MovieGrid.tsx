import React from 'react';
import Image from 'next/image';
import type { Movie } from '../types/movie';

interface MovieGridProps {
  movies: Movie[];
}

const MovieGrid = ({ movies }: MovieGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {movies.map((movie) => (
        <div 
          key={movie.id}
          className="group relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-800/50 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-black/50"
        >
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
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
  );
};

export default MovieGrid;