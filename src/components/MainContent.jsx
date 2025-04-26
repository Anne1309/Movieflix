
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMG_BASE_URL = import.meta.env.VITE_IMG_BASE_URL;

const MainContent = ({ onLogout }) => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  const fetchTrendingMovies = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`
      );
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch movies. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${searchQuery}`
      );
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      toast({
        title: "Error",
        description: "Search failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">MovieFlix</h1>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="nav-link">Movies</a>
              <a href="#" className="nav-link">TV Shows</a>
              <a href="#" className="nav-link">My List</a>
              <Button onClick={onLogout} variant="secondary">
                Logout
              </Button>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border"
            >
              <div className="px-4 py-2 space-y-2">
                <a href="#" className="block nav-link py-2">Movies</a>
                <a href="#" className="block nav-link py-2">TV Shows</a>
                <a href="#" className="block nav-link py-2">My List</a>
                <Button onClick={onLogout} variant="secondary" className="w-full">
                  Logout
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <section className="hero-section">
        <div className="hero-overlay" />
        <img  alt="Featured movie banner" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1638548066985-96b4008c67aa" />
        <div className="hero-content">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to MovieFlix</h1>
          <p className="text-xl mb-8">Discover thousands of movies and TV shows.</p>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="search"
              placeholder="Search for movies..."
              className="search-bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="lg">
              <Search className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="movie-grid"
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              className="movie-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={`${IMG_BASE_URL}${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="movie-info">
                <h3 className="text-lg font-semibold">{movie.title}</h3>
                <p className="text-sm text-gray-300">
                  {new Date(movie.release_date).getFullYear()}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default MainContent;
