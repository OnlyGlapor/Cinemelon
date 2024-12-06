'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchMovieRecommendations, fetchMoviesByMood } from '../lib/tmdb';
import MovieGrid from '../components/MovieGrid';
import { ArrowLeft } from 'lucide-react';

type Mood =
  | 'Happy'
  | 'Sad'
  | 'Relaxed'
  | 'Thoughtful'
  | 'Thrilled'
  | 'Romantic';

const RecommendationsPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mood = searchParams.get('mood');
    const movieId = searchParams.get('movieId');
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        let data;
        if (movieId) {
          data = await fetchMovieRecommendations(Number(movieId));
        } else if (mood) {
          data = await fetchMoviesByMood(mood as Mood);
        } else {
          // Handle the case when neither movieId nor mood is available
          data = { results: [] };
        }
        setMovies(data.results);
      } catch (err) {
        setError('Failed to fetch movie recommendations');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [movieId, mood]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
        <h1 className="text-4xl font-bold mb-8">
          {movieId ? 'Similar Movie Recommendations' : mood ? `Movies for "${mood}" Mood` : 'Movie Recommendations'}
        </h1>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : movies.length > 0 ? (
          <MovieGrid movies={movies} />
        ) : (
          <div className="text-center">No movie recommendations found.</div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;