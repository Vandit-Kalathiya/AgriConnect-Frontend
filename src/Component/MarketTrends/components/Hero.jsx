import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import SearchBar from './SearchBar';
import { ArrowRight, BarChart3, Sprout, TrendingUp } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-[85vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-forest-50/80 via-forest-50/60 to-transparent dark:from-forest-950/80 dark:via-forest-950/60 -z-10"></div>
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzZTY3M2IiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoLTZWMzRoLTZ2LTZoNnYtNmg2djZoNnY2aC02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50 dark:opacity-20 -z-10"></div>
      
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              <span className="text-forest-700 dark:text-forest-300">Real-time Insights for </span>
              <span className="text-primary">Indian Agriculture</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Access comprehensive market data, price analytics, and expert recommendations for all major Indian crops.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-2 bg-forest-50 dark:bg-forest-900/30 px-3 py-1.5 rounded-full text-forest-700 dark:text-forest-300 text-sm">
                <Sprout size={16} />
                <span>150+ Crops</span>
              </div>
              <div className="flex items-center gap-2 bg-forest-50 dark:bg-forest-900/30 px-3 py-1.5 rounded-full text-forest-700 dark:text-forest-300 text-sm">
                <BarChart3 size={16} />
                <span>Real-time Prices</span>
              </div>
              <div className="flex items-center gap-2 bg-forest-50 dark:bg-forest-900/30 px-3 py-1.5 rounded-full text-forest-700 dark:text-forest-300 text-sm">
                <TrendingUp size={16} />
                <span>Price Forecasts</span>
              </div>
            </div>
            
            <SearchBar />
            
            <div className="mt-8 text-center sm:text-left">
              <Link to="/trends">
                <Button className="group text-white bg-green-600 hover:bg-green-700 ">
                  <span>Explore Market Trends</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-scale-in">
            <div className="relative w-full max-w-md">
              <img 
                src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Indian farmer with crops" 
                className="rounded-2xl shadow-xl"
              />
              
              {/* <div className="absolute -bottom-6 -left-6 glass-card p-4 rounded-xl shadow-lg animate-float max-w-[200px]">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Wheat</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">↑ 3.2% this week</p>
                  </div>
                </div>
              </div>
               */}
              {/* <div className="absolute -top-6 -right-6 glass-card p-4 rounded-xl shadow-lg animate-float delay-150 max-w-[180px]">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                    <BarChart3 className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Tomato</h3>
                    <p className="text-sm text-red-600 dark:text-red-400">↓ 5.8% this week</p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;