import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Movie {
    id: number;
    poster_path: string;
    title: string;
    vote_average: string;
}

interface MovieGrid {
    movies: Movie[];
}

const MovieGrid = ({ movies }: MovieGrid) => {
  const router = useRouter();

  const handleMovieClick = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="relative overflow-hidden rounded-xl bg-gray-800 shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => handleMovieClick(movie.id)}
        >
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={500}
            height={750}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black via-transparent to-transparent">
            <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
            <div className="flex items-center">
              <span className="text-yellow-400 mr-2">&#9733;</span>
              <span>{movie.vote_average}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;