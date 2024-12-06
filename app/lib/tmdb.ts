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