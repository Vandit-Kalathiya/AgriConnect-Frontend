import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { TrendingUp, Grape, Wheat, Carrot } from 'lucide-react';
import { toast } from 'sonner';

const TrendingCrops = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [trendingCrops, setTrendingCrops] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    const fetchTrendingCrops = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockCrops = [
          {
            id: 'tomato',
            name: 'Tomato',
            category: 'vegetables',
            currentPrice: 32.5,
            priceChange: 2.5,
            percentChange: 8.33,
            volume: 1245,
            unit: 'kg',
            trend: 'up',
            icon: '🍅'
          },
          {
            id: 'potato',
            name: 'Potato',
            category: 'vegetables',
            currentPrice: 18.75,
            priceChange: -1.25,
            percentChange: -6.25,
            volume: 3100,
            unit: 'kg',
            trend: 'down',
            icon: '🥔'
          },
          {
            id: 'rice',
            name: 'Rice (Basmati)',
            category: 'grains',
            currentPrice: 85,
            priceChange: 5,
            percentChange: 6.25,
            volume: 2800,
            unit: 'kg',
            trend: 'up',
            icon: '🍚'
          },
          {
            id: 'wheat',
            name: 'Wheat',
            category: 'grains',
            currentPrice: 32,
            priceChange: 0.5,
            percentChange: 1.59,
            volume: 4200,
            unit: 'kg',
            trend: 'up',
            icon: '🌾'
          },
          {
            id: 'mango',
            name: 'Mango (Alphonso)',
            category: 'fruits',
            currentPrice: 450,
            priceChange: 50,
            percentChange: 12.5,
            volume: 850,
            unit: 'kg',
            trend: 'up',
            icon: '🥭'
          },
          {
            id: 'onion',
            name: 'Onion',
            category: 'vegetables',
            currentPrice: 28.5,
            priceChange: -3.5,
            percentChange: -10.94,
            volume: 2700,
            unit: 'kg',
            trend: 'down',
            icon: '🧅'
          },
          {
            id: 'banana',
            name: 'Banana',
            category: 'fruits',
            currentPrice: 65,
            priceChange: 3,
            percentChange: 4.84,
            volume: 1400,
            unit: 'dozen',
            trend: 'up',
            icon: '🍌'
          },
          {
            id: 'sugar',
            name: 'Sugarcane',
            category: 'grains',
            currentPrice: 3.2,
            priceChange: 0.1,
            percentChange: 3.23,
            volume: 12000,
            unit: 'kg',
            trend: 'up',
            icon: '🍬'
          },
          {
            id: 'apple',
            name: 'Apple (Shimla)',
            category: 'fruits',
            currentPrice: 180,
            priceChange: -12,
            percentChange: -6.25,
            volume: 950,
            unit: 'kg',
            trend: 'down',
            icon: '🍎'
          },
          {
            id: 'cotton',
            name: 'Cotton',
            category: 'grains',
            currentPrice: 6200,
            priceChange: 200,
            percentChange: 3.33,
            volume: 450,
            unit: 'quintal',
            trend: 'up',
            icon: '🧵'
          },
          {
            id: 'chilli',
            name: 'Red Chilli',
            category: 'vegetables',
            currentPrice: 128,
            priceChange: 18,
            percentChange: 16.36,
            volume: 720,
            unit: 'kg',
            trend: 'up',
            icon: '🌶'
          },
          {
            id: 'orange',
            name: 'Orange (Nagpur)',
            category: 'fruits',
            currentPrice: 75,
            priceChange: 2,
            percentChange: 2.74,
            volume: 1100,
            unit: 'kg',
            trend: 'up',
            icon: '🍊'
          },
          {
            id: 'coconut',
            name: 'Coconut',
            category: 'fruits',
            currentPrice: 25,
            priceChange: -2,
            percentChange: -7.41,
            volume: 3500,
            unit: 'piece',
            trend: 'down',
            icon: '🥥'
          },
          {
            id: 'corn',
            name: 'Corn (Maize)',
            category: 'grains',
            currentPrice: 24.5,
            priceChange: 1.5,
            percentChange: 6.52,
            volume: 2900,
            unit: 'kg',
            trend: 'up',
            icon: '🌽'
          },
          {
            id: 'cucumber',
            name: 'Cucumber',
            category: 'vegetables',
            currentPrice: 40,
            priceChange: -5,
            percentChange: -11.11,
            volume: 780,
            unit: 'kg',
            trend: 'down',
            icon: '🥒'
          }
        ];
        
        setTrendingCrops(mockCrops);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching trending crops:', error);
        toast.error('Failed to load trending crops. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchTrendingCrops();
  }, []);

  const filteredCrops = trendingCrops.filter(crop => 
    activeTab === 'all' ? true : crop.category === activeTab
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted rounded-md animate-pulse"></div>
          <div className="h-10 w-64 bg-muted rounded-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[...Array(15)].map((_, index) => (
            <div key={index} className="trend-card h-28 animate-pulse">
              <div className="h-6 w-3/4 bg-muted rounded-md mb-2"></div>
              <div className="h-5 w-1/2 bg-muted rounded-md mb-3"></div>
              <div className="h-5 w-1/3 bg-muted rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <TrendingUp className="text-primary" />
          <span>Trending Crops in India</span>
        </h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all" className="flex items-center gap-1.5">
              <TrendingUp size={16} />
              <span className="hidden sm:inline">All</span>
            </TabsTrigger>
            <TabsTrigger value="fruits" className="flex items-center gap-1.5">
              <Grape size={16} />
              <span className="hidden sm:inline">Fruits</span>
            </TabsTrigger>
            <TabsTrigger value="vegetables" className="flex items-center gap-1.5">
              <Carrot size={16} />
              <span className="hidden sm:inline">Vegetables</span>
            </TabsTrigger>
            <TabsTrigger value="grains" className="flex items-center gap-1.5">
              <Wheat size={16} />
              <span className="hidden sm:inline">Grains</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {filteredCrops.map((crop) => (
          <Link key={crop.id} to={`/crop/market/${crop.id}`} className="trend-card border rounded p-3 hover:shadow-xl bg-green-50/20">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl mb-1">{crop.icon}</div>
                <h3 className="font-medium text-lg">{crop.name}</h3>
                <p className="text-muted-foreground text-sm">
                  ₹{crop.currentPrice}/{crop.unit}
                </p>
              </div>
              <div 
                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
                  ${crop.trend === 'up' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-600' 
                    : crop.trend === 'down' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-600' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}
              >
                {crop.trend === 'up' ? '↑' : crop.trend === 'down' ? '↓' : '→'}
                {Math.abs(crop.percentChange).toFixed(1)}%
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Vol: {crop.volume.toLocaleString()} {crop.unit}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingCrops;