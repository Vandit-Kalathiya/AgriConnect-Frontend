import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { 
  AlertTriangle, TrendingUp, Leaf, AlertCircle, BarChart3,
  ArrowRight, CloudRain, PiggyBank, Coins, Lightbulb
} from 'lucide-react';
import { getFormattedCurrentDate } from '../utils/DateUtils';
import { toast } from 'sonner';

const EnhancedRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const currentDate = getFormattedCurrentDate();
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockRecommendations = [
          {
            id: 'rec1',
            type: 'positive',
            title: 'Sowing Window for Kharif Crops Opening',
            content: 'With the arrival of monsoon, now is the optimal time to prepare for sowing kharif crops like paddy, maize, and pulses. Early sowing can help maximize yield potential.',
            category: 'weather',
            date: currentDate,
            source: 'Indian Meteorological Department',
            icon: <CloudRain size={20} className="text-blue-600 dark:text-blue-400" />
          },
          {
            id: 'rec2',
            type: 'warning',
            title: 'Tomato Price Volatility Expected',
            content: 'Due to unseasonal rains in major growing regions, tomato prices are expected to remain volatile for the next 2-3 weeks. Consider diversifying your market outlets.',
            category: 'market',
            date: currentDate,
            source: 'National Horticultural Board',
            icon: <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400" />
          },
          {
            id: 'rec3',
            type: 'positive',
            title: 'New MSP Announced for Rabi Crops',
            content: 'Government has announced a 5-7% increase in Minimum Support Prices for rabi crops including wheat, barley, and gram for the upcoming season.',
            category: 'policy',
            date: currentDate,
            source: 'Ministry of Agriculture',
            icon: <Leaf size={20} className="text-green-600 dark:text-green-400" />
          },
          {
            id: 'rec4',
            type: 'neutral',
            title: 'Subsidized Loan Applications Open',
            content: 'Kisan Credit Card scheme applications are now being accepted with 2% interest subsidy for loans up to ₹3 lakhs. Visit your nearest bank branch for details.',
            category: 'financial',
            date: currentDate,
            source: 'NABARD',
            icon: <PiggyBank size={20} className="text-purple-600 dark:text-purple-400" />
          },
          {
            id: 'rec5',
            type: 'positive',
            title: 'Export Demand for Basmati Rice Rising',
            content: 'International demand for premium Indian basmati rice is rising. Farmers in traditional basmati growing regions may expect better prices in coming months.',
            category: 'market',
            date: currentDate,
            source: 'Agricultural and Processed Food Products Export Development Authority',
            icon: <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
          },
          {
            id: 'rec6',
            type: 'warning',
            title: 'Prepare for Delayed Monsoon Withdrawal',
            content: 'Meteorological data suggests delayed monsoon withdrawal this year. Farmers should prepare for extended rainfall periods when planning harvesting activities.',
            category: 'weather',
            date: currentDate,
            source: 'Indian Meteorological Department',
            icon: <AlertCircle size={20} className="text-amber-600 dark:text-amber-400" />
          },
          {
            id: 'rec7',
            type: 'neutral',
            title: 'New Crop Insurance Deadline Approaching',
            content: 'The last date to register for the Pradhan Mantri Fasal Bima Yojana for kharif crops is July 31. Ensure timely registration to secure coverage.',
            category: 'policy',
            date: currentDate,
            source: 'Ministry of Agriculture',
            icon: <Lightbulb size={20} className="text-blue-600 dark:text-blue-400" />
          },
          {
            id: 'rec8',
            type: 'positive',
            title: 'Invest in Storage Infrastructure',
            content: 'With current market trends, investing in proper storage facilities can help you avoid selling at lower prices during harvest gluts and capitalize on price increases later.',
            category: 'financial',
            date: currentDate,
            source: 'National Bank for Agriculture and Rural Development',
            icon: <Coins size={20} className="text-green-600 dark:text-green-400" />
          }
        ];
        
        setRecommendations(mockRecommendations);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        toast.error('Failed to load recommendations. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentDate]);

  const filteredRecommendations = recommendations.filter(rec => 
    activeCategory === 'all' ? true : rec.category === activeCategory
  );

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'market': return <BarChart3 size={16} />;
      case 'weather': return <CloudRain size={16} />;
      case 'policy': return <Leaf size={16} />;
      case 'financial': return <Coins size={16} />;
      default: return <Lightbulb size={16} />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Real-time Recommendations</CardTitle>
          <CardDescription>Loading latest insights for farmers...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-24 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle className="text-xl">Real-time Recommendations</CardTitle>
            <CardDescription>Personalized insights based on current market conditions</CardDescription>
          </div>
          <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground mt-2 sm:mt-0">
            Last Updated: {currentDate}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all" className="flex items-center gap-1.5">
              <Lightbulb size={16} />
              <span className="hidden sm:inline">All</span>
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center gap-1.5">
              <BarChart3 size={16} />
              <span className="hidden sm:inline">Market</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center gap-1.5">
              <CloudRain size={16} />
              <span className="hidden sm:inline">Weather</span>
            </TabsTrigger>
            <TabsTrigger value="policy" className="flex items-center gap-1.5">
              <Leaf size={16} />
              <span className="hidden sm:inline">Policy</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-1.5">
              <Coins size={16} />
              <span className="hidden sm:inline">Finance</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {filteredRecommendations.map((rec) => (
            <div 
              key={rec.id} 
              className={`recommendation-card ${rec.type} hover:shadow-md transition-shadow p-4 rounded-lg border flex flex-col sm:flex-row items-start gap-3`}
            >
              {rec.icon}
              <div className="flex-1">
                <div className="flex flex-wrap justify-between gap-2 mb-1">
                  <h4 className="font-medium">{rec.title}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full text-zinc-800 bg-gray-200">
                    {rec.category.charAt(0).toUpperCase() + rec.category.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rec.content}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Source: {rec.source}</span>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-green-600">
                    Details <ArrowRight size={12} className="ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedRecommendations;