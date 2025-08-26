import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/crop/${searchQuery.toLowerCase().replace(/\s+/g, '-')}`;
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-forest-950/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary rounded-lg w-10 h-10 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">CI</span>
          </div>
          <div className="font-bold text-xl hidden sm:block">
            <span className="text-forest-700 dark:text-forest-300">Crop</span>
            <span className="text-primary">Insight</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md">Home</Link>
            <Link to="/trends" className="text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md">Trends</Link>
            <Link to="/market" className="text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md">Market</Link>
            <Link to="/insights" className="text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md">Insights</Link>
          </nav>
          
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search any crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8 w-60 bg-muted transition-all focus:w-72"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
              <Search size={18} />
            </button>
          </form>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsDarkMode(prev => !prev)}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsDarkMode(prev => !prev)}
            aria-label="Toggle theme"
            className="mr-1"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-background z-40 animate-fade-in">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-6">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search any crop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-8 w-full"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search size={18} />
              </button>
            </form>
            
            <nav className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-lg font-medium px-4 py-3 border-b border-border"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/trends" 
                className="text-lg font-medium px-4 py-3 border-b border-border"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trends
              </Link>
              <Link 
                to="/market" 
                className="text-lg font-medium px-4 py-3 border-b border-border"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Market
              </Link>
              <Link 
                to="/insights" 
                className="text-lg font-medium px-4 py-3 border-b border-border"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Insights
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;