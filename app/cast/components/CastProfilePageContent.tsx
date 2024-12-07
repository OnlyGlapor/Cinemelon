'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft,
  Star,
  Film,
  TrendingUp,
  User,
  ChevronRight,
  Twitter,
  Instagram,
  Facebook,
} from 'lucide-react';

interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  gender: number;
  popularity: number;
  homepage: string | null;
  external_ids: {
    facebook_id: string | null;
    instagram_id: string | null;
    twitter_id: string | null;
  };
}

interface MovieCredit {
  id: number;
  title: string;
  character: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
  popularity: number;
}

const calculateAge = (birthday: string | null, deathday: string | null): number | null => {
  if (!birthday) return null;
  try {
    const birth = new Date(birthday);
    const end = deathday ? new Date(deathday) : new Date();
    if (isNaN(birth.getTime()) || (deathday && isNaN(new Date(deathday).getTime()))) {
      return null;
    }
    return Math.floor((end.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  } catch {
    return null;
  }
};

const CastProfilePageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const personId = searchParams.get('id');
  
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [credits, setCredits] = useState<MovieCredit[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPersonData = async () => {
      if (!personId) return;

      try {
        setIsLoading(true);
        const [personData, creditsData] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=external_ids`)
            .then(res => res.json()),
          fetch(`https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`)
            .then(res => res.json())
        ]);

        setPerson(personData);
        setCredits(creditsData.cast.sort((a: MovieCredit, b: MovieCredit) => 
          new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
        ));
      } catch (err) {
        setError('Failed to load cast member details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonData();
  }, [personId]);

  const years = ['all', ...new Set(credits
    .filter(movie => movie.release_date)
    .map(movie => new Date(movie.release_date).getFullYear().toString())
    .sort((a, b) => parseInt(b) - parseInt(a))
  )];

  const filteredMovies = credits.filter(movie => 
    selectedYear === 'all' || 
    new Date(movie.release_date).getFullYear().toString() === selectedYear
  );

  const socialLinks = person?.external_ids && {
    twitter: person.external_ids.twitter_id ? `https://twitter.com/${person.external_ids.twitter_id}` : null,
    instagram: person.external_ids.instagram_id ? `https://instagram.com/${person.external_ids.instagram_id}` : null,
    facebook: person.external_ids.facebook_id ? `https://facebook.com/${person.external_ids.facebook_id}` : null,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-yellow-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-400 animate-pulse">Loading cast member details...</p>
        </div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-red-400 mb-4">{error || 'Cast member not found'}</p>
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

  const currentPopularMovies = credits
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Background with Gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" />
        {person.profile_path && (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
              alt={person.name}
              fill
              className="object-cover opacity-10"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/80 to-gray-900" />
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Profile Image */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                {person.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
                    alt={person.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <User className="w-20 h-20 text-gray-600" />
                  </div>
                )}
              </div>

              {/* Personal Info */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-semibold">Personal Info</h3>
                
                <div className="space-y-4">
                  {person.known_for_department && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Known For</p>
                      <p>{person.known_for_department}</p>
                    </div>
                  )}
                  
                  {person.birthday && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Born</p>
                      <p>
                        {new Date(person.birthday).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        {!person.deathday && calculateAge(person.birthday, null) !== null && 
                          ` (${calculateAge(person.birthday, null)} years old)`}
                      </p>
                    </div>
                  )}

                  {person.deathday && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Died</p>
                      <p>
                        {new Date(person.deathday).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        {calculateAge(person.birthday, person.deathday) !== null && 
                          ` (${calculateAge(person.birthday, person.deathday)} years old)`}
                      </p>
                    </div>
                  )}

                  {person.place_of_birth && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Place of Birth</p>
                      <p>{person.place_of_birth}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Links */}
              {socialLinks && Object.values(socialLinks).some(link => link) && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Social Media</h3>
                  <div className="flex gap-4">
                    {socialLinks.twitter && (
                      <a 
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {socialLinks.instagram && (
                      <a 
                        href={socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 rounded-lg transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {socialLinks.facebook && (
                      <a 
                        href={socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 rounded-lg transition-colors"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                {person.name}
              </h1>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 rounded-full px-4 py-2">
                  <Film className="w-5 h-5" />
                  <span>{credits.length} Movies</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400 bg-blue-400/10 rounded-full px-4 py-2">
                  <Star className="w-5 h-5" />
                  <span>{credits.filter(movie => movie.vote_average >= 7.5).length} Notable Roles</span>
                </div>
                <div className="flex items-center gap-2 text-green-400 bg-green-400/10 rounded-full px-4 py-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>{typeof person.popularity === 'number' ? person.popularity.toFixed(1) : 'N/A'}</span>
                </div>
              </div>

              {person.biography && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {person.biography}
                  </p>
                </div>
              )}
            </div>

            {/* Current Popular Movies */}
            {currentPopularMovies.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Currently Popular</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {currentPopularMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="group cursor-pointer"
                      onClick={() => router.push(`/movie?id=${movie.id}`)}
                    >
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-gray-800">
                        {movie.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                            <Film className="w-12 h-12 text-gray-600" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <h3 className="font-medium group-hover:text-yellow-400 transition-colors">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>{!isNaN(movie.vote_average) ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filmography */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Filmography</h2>
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="appearance-none bg-gray-800/50 backdrop-blur-sm text-white rounded-lg px-4 py-2 pr-8 hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year === 'all' ? 'All Years' : year}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {filteredMovies.map((movie) => (
                  <div
                    key={`${movie.id}-${movie.character}`}
                    className="group cursor-pointer"
                    onClick={() => router.push(`/movie?id=${movie.id}`)}
                  >
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-gray-800/50 backdrop-blur-sm shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                          <Film className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Hover Overlay Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="inline-flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 rounded-full px-2 py-1 backdrop-blur-sm">
                          <Star className="w-3 h-3" />
                          View Movie
                        </span>
                      </div>
                    </div>
                    <h3 className="font-medium group-hover:text-yellow-400 transition-colors">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : 'N/A'}</span>

                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 italic">
                      as {movie.character}
                    </p>
                  </div>
                ))}
              </div>

              {filteredMovies.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">No movies found for the selected year.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastProfilePageContent;