'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  Star,
  Film,
  User,
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

  const handleBack = () => {
    router.back();
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
              onClick={handleBack}
              className="text-sm text-gray-400 hover:text-white transition-colors underline"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Personal Info */}
          <div className="space-y-6">
            {/* Profile Image */}
            <div className="aspect-[3/4] relative rounded-2xl overflow-hidden shadow-2xl">
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
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold">Personal Info</h2>
              
              {person.birthday && (
                <div>
                  <p className="text-sm text-gray-400">Born</p>
                  <p>{new Date(person.birthday).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}</p>
                </div>
              )}
              
              {person.place_of_birth && (
                <div>
                  <p className="text-sm text-gray-400">Place of Birth</p>
                  <p>{person.place_of_birth}</p>
                </div>
              )}
              
              {person.known_for_department && (
                <div>
                  <p className="text-sm text-gray-400">Known For</p>
                  <p>{person.known_for_department}</p>
                </div>
              )}
            </div>

            {/* Social Links */}
            {socialLinks && Object.values(socialLinks).some(link => link) && (
              <div className="flex gap-2">
                {socialLinks.twitter && (
                  <a 
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 p-3 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Twitter className="w-5 h-5" />
                    <span className="text-sm">Twitter</span>
                  </a>
                )}
                {socialLinks.instagram && (
                  <a 
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 p-3 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Instagram className="w-5 h-5" />
                    <span className="text-sm">Instagram</span>
                  </a>
                )}
                {socialLinks.facebook && (
                  <a 
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 p-3 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Facebook className="w-5 h-5" />
                    <span className="text-sm">Facebook</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Bio & Filmography */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{person.name}</h1>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Film className="w-4 h-4 text-yellow-500" />
                  <span>{credits.length} Movies</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{person.popularity.toFixed(1)} Popularity</span>
                </div>
              </div>
            </div>

            {/* Biography */}
            {person.biography && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4">Biography</h2>
                <p className="text-gray-300 leading-relaxed">{person.biography}</p>
              </div>
            )}

            {/* Filmography Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Filmography</h2>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-gray-800/50 backdrop-blur-sm text-white rounded-xl px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year === 'all' ? 'All Years' : year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredMovies.map((movie) => (
                  <div
                    key={`${movie.id}-${movie.character}`}
                    className="group cursor-pointer"
                    onClick={() => router.push(`/movie?id=${movie.id}`)}
                  >
                    <div className="aspect-[2/3] relative rounded-xl overflow-hidden bg-gray-800">
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Film className="w-1/3 h-1/3 text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-sm font-medium text-white text-center px-2">
                            View Movie
                          </p>
                        </div>
                      </div>
                    </div>
                    <h3 className="mt-2 font-medium text-sm group-hover:text-yellow-500 transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-gray-400">as {movie.character}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastProfilePageContent;