// lib/tmdb.ts

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchTrendingMovies() {
  const response = await fetch(
    `${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch trending movies');
  }
  
  return response.json();
}

export async function fetchMoviesByGenres(genreIds: number[]) {
  const response = await fetch(
    `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreIds.join(',')}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch movies by genres');
  }

  return response.json();
}

export async function fetchMovieDetails(movieId: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch movie details');
  }

  return response.json();
}

export async function searchMovies(query: string) {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error('Failed to search movies');
  }

  return response.json();
}

export async function fetchGenres() {
  const response = await fetch(
    `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch genres');
  }

  return response.json();
}

export async function fetchSimilarMovies(movieId: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch similar movies');
  }

  return response.json();
}

export async function fetchMovieRecommendations(movieId: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch movie recommendations');
  }

  return response.json();
}

// For the upcoming movies section
export async function fetchUpcomingMovies() {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch upcoming movies');
  }

  return response.json();
}

// For popular movies
export async function fetchPopularMovies() {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch popular movies');
  }

  return response.json();
}

// For top rated movies
export async function fetchTopRatedMovies() {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch top rated movies');
  }

  return response.json();
}

// For movie videos (trailers, teasers, etc.)
export async function fetchMovieVideos(movieId: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch movie videos');
  }

  return response.json();
}

// To discover movies with additional parameters
export async function discoverMovies({
  genres,
  year,
  sortBy = 'popularity.desc',
  page = 1
}: {
  genres?: number[];
  year?: number;
  sortBy?: string;
  page?: number;
}) {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY as string,
    page: page.toString(),
    sort_by: sortBy
  });

  if (genres?.length) {
    params.append('with_genres', genres.join(','));
  }

  if (year) {
    params.append('primary_release_year', year.toString());
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/discover/movie?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error('Failed to discover movies');
  }

  return response.json();
}

type Movie = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
};

// Add or update the mood to genre/keyword mapping
const moodToGenreKeywords: Record<string, { genres?: number[]; keywords?: number[] }> = {
  "Happy": {
    genres: [35, 10751], // Comedy, Family
    keywords: [9717, 9716] // Feel-good, Happiness
  },
  "Sad": {
    genres: [18], // Drama
    keywords: [12392, 180547] // Tearjerker, Depression
  },
  "Scared": {
    genres: [27, 53], // Horror, Thriller
    keywords: [6152, 10349] // Suspense, Fear
  },
  "Cool": {
    genres: [28, 12], // Action, Adventure
    keywords: [9663, 33765] // Stylized, Badass
  },
  "Thoughtful": {
    genres: [878, 99], // Science Fiction, Documentary
    keywords: [156, 10339] // Philosophical, Thought-provoking
  },
  "Funny": {
    genres: [35], // Comedy
    keywords: [9715, 9714] // Humor, Slapstick
  }
};

export const fetchMoviesByMood = async (mood: string): Promise<Movie[]> => {
  if (!mood || !moodToGenreKeywords[mood]) {
    throw new Error('Invalid mood specified');
  }

  const { genres = [], keywords = [] } = moodToGenreKeywords[mood];
  
  try {
    // First try with both genres and keywords
    let response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=${genres.join(',')}&with_keywords=${keywords.join(',')}&sort_by=popularity.desc`
    );
    let data = await response.json();

    // If we don't get enough results, try with just genres
    if (data.results.length < 5 && genres.length > 0) {
      response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=${genres.join(',')}&sort_by=popularity.desc`
      );
      data = await response.json();
    }

    return data;
  } catch (error) {
    console.error('Error fetching movies by mood:', error);
    throw error;
  }
};

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  download_links?: {
    quality: string;
    url: string;
    size: string;
  }[];
}

export async function getMovieDetails(movieId: string): Promise<MovieDetails> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch movie details');
  }

  const data = await response.json();

  // For demonstration purposes, we'll add mock download links
  // In a real application, you would get these from a legitimate source
  const movieDetails = {
    ...data,
    download_links: [
      {
        quality: '1080p',
        url: `/api/download/${movieId}/1080p`,
        size: '2.1 GB'
      },
      {
        quality: '720p',
        url: `/api/download/${movieId}/720p`,
        size: '1.3 GB'
      }
    ]
  };

  return movieDetails;
}

// Add this function to get legal watch providers
export async function getWatchProviders(movieId: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch watch providers');
  }
  
  return response.json();
}
