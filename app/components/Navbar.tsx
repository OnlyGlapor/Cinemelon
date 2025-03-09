'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, TrendingUp, LogIn, Menu, X, Sparkles, ArrowLeft } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Check if we're on the cast profile page
  const isCastPage = pathname.startsWith('/cast');

  const handleLogin = () => {
    alert('Login functionality coming soon!');
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {isCastPage ? (
            // Show back button on cast profile page
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-lg font-medium">Back</span>
            </button>
          ) : (
            // Show logo on other pages
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-yellow-400" />
                <div className="w-8 h-8 bg-yellow-500/20 rounded-full absolute animate-ping" />
                <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Cinemelon
                </span>
              </div>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink href="/" icon={<Home className="w-4 h-4" />} active={pathname === '/'}>
              Home
            </NavLink>
            <NavLink href="/trending" icon={<TrendingUp className="w-4 h-4" />} active={pathname === '/trending'}>
              Trending
            </NavLink>
            <NavLink href="/search" icon={<Search className="w-4 h-4" />} active={pathname === '/search'}>
              Search
            </NavLink>
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300
                       bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
            >
              <LogIn className="w-4 h-4" />
              <span className="font-medium">Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-64 border-t border-white/10' : 'max-h-0'
        } overflow-hidden bg-gray-900/95 backdrop-blur-sm`}
      >
        <div className="container mx-auto px-4 py-4 space-y-2">
          <MobileNavLink href="/" icon={<Home className="w-5 h-5" />} active={pathname === '/'}>
            Home
          </MobileNavLink>
          <MobileNavLink href="/trending" icon={<TrendingUp className="w-5 h-5" />} active={pathname === '/trending'}>
            Trending
          </MobileNavLink>
          <MobileNavLink href="/search" icon={<Search className="w-5 h-5" />} active={pathname === '/search'}>
            Search
          </MobileNavLink>
          <button
            onClick={handleLogin}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                     bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
          >
            <LogIn className="w-5 h-5" />
            <span className="font-medium">Login</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, children, active }: { href: string; icon: React.ReactNode; children: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
        active 
          ? 'bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/50' 
          : 'text-gray-400 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      <span className="font-medium">{children}</span>
    </Link>
  );
}

function MobileNavLink({ href, icon, children, active }: { href: string; icon: React.ReactNode; children: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
        active 
          ? 'bg-yellow-500/10 text-yellow-500' 
          : 'text-gray-400 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      <span className="font-medium">{children}</span>
    </Link>
  );
} 