import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { Card } from '../components/UI/Card';
import { toast } from 'sonner';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const cropsDatabase = [
    { id: 'rice', name: 'Rice', category: 'Grains', icon: '🍚' },
    { id: 'wheat', name: 'Wheat', category: 'Grains', icon: '🌾' },
    { id: 'tomato', name: 'Tomato', category: 'Vegetables', icon: '🍅' },
    { id: 'potato', name: 'Potato', category: 'Vegetables', icon: '🥔' },
    { id: 'onion', name: 'Onion', category: 'Vegetables', icon: '🧅' },
    { id: 'mango', name: 'Mango', category: 'Fruits', icon: '🥭' },
    { id: 'apple', name: 'Apple', category: 'Fruits', icon: '🍎' },
    { id: 'banana', name: 'Banana', category: 'Fruits', icon: '🍌' },
    { id: 'sugar', name: 'Sugarcane', category: 'Grains', icon: '🍬' },
    { id: 'maize', name: 'Maize', category: 'Grains', icon: '🌽' },
    { id: 'cotton', name: 'Cotton', category: 'Fibers', icon: '🧵' },
    { id: 'soybean', name: 'Soybean', category: 'Grains', icon: '🌱' },
    { id: 'chilli', name: 'Red Chilli', category: 'Spices', icon: '🌶️' },
    { id: 'turmeric', name: 'Turmeric', category: 'Spices', icon: '🟡' },
    { id: 'coconut', name: 'Coconut', category: 'Fruits', icon: '🥥' },
    { id: 'mustard', name: 'Mustard', category: 'Oilseeds', icon: '🌱' },
    { id: 'groundnut', name: 'Groundnut', category: 'Oilseeds', icon: '🥜' },
    { id: 'coffee', name: 'Coffee', category: 'Beverages', icon: '☕' },
    { id: 'tea', name: 'Tea', category: 'Beverages', icon: '🍵' },
    { id: 'jute', name: 'Jute', category: 'Fibers', icon: '🧶' },
    { id: 'cardamom', name: 'Cardamom', category: 'Spices', icon: '🌿' },
    { id: 'ginger', name: 'Ginger', category: 'Spices', icon: '🫚' },
    { id: 'grapes', name: 'Grapes', category: 'Fruits', icon: '🍇' },
    { id: 'cauliflower', name: 'Cauliflower', category: 'Vegetables', icon: '🥦' },
    { id: 'orange', name: 'Orange', category: 'Fruits', icon: '🍊' },
  ];

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const searchCrops = async () => {
      setIsSearching(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const filtered = cropsDatabase.filter(crop => 
          crop.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setSearchResults(filtered);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching crops:', error);
        toast.error('Failed to search crops. Please try again.');
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(() => {
      searchCrops();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/crop/${searchQuery.toLowerCase().replace(/\s+/g, '-')}`);
      setSearchQuery('');
      setShowResults(false);
    }
  };

  const handleResultClick = (id) => {
    navigate(`/crop/${id}`);
    setSearchQuery('');
    setShowResults(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search any crop (e.g. Rice, Wheat, Mango)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white dark:bg-forest-950/50 pr-16 py-6 text-lg shadow-md"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchQuery && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X size={18} />
            </Button>
          )}
          <Button 
            type="submit" 
            variant="ghost" 
            size="icon"
            aria-label="Search"
            disabled={isSearching}
          >
            {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          </Button>
        </div>
      </form>

      {showResults && searchResults.length > 0 && (
        <Card className="absolute z-10 mt-1 w-full max-h-[400px] overflow-y-auto shadow-xl">
          <ul className="py-2 divide-y">
            {searchResults.map((result) => (
              <li key={result.id}>
                <button 
                  onClick={() => handleResultClick(result.id)}
                  className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-3"
                >
                  <span className="text-2xl">{result.icon}</span>
                  <div>
                    <p className="font-medium">{result.name}</p>
                    <p className="text-sm text-muted-foreground">{result.category}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {showResults && searchQuery && searchResults.length === 0 && (
        <Card className="absolute z-10 mt-1 w-full shadow-xl p-4 text-center">
          <p className="text-muted-foreground">No crops found matching "{searchQuery}"</p>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;