import Hero from "../components/Hero";
import TrendingCrops from "../components/TrendingCrops";
import MarketInsights from "../components/MarketInsights";
import Footer from "../components/Footer";
import Header from "../components/Header";
import CurrentMonthHighlights from "../components/CurrentMonthHighlights";
import EnhancedRecommendations from "../components/EnhancedRecommendations";
import SubscriptionBanner from "../components/SubscriptionBanner";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sprout,
  BarChart3,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { getCurrentMonth, getCurrentYear } from "../Utils/DateUtils";

const Index2 = () => {
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  return (
    <div className="min-h-screen max-w-screen overflow-x-hidden">
      {/* <Header /> */}
      <div className="pl-16">
        <div className="container mx-auto px-5 py-10 pl-10">
          <Hero />
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-primary">📊</span>
              <span>
                Indian Agricultural Market | {currentMonth} {currentYear}
              </span>
            </h2>
            <CurrentMonthHighlights />
          </div>
          <TrendingCrops />
          <div className="mb-16">
            <EnhancedRecommendations />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white dark:bg-forest-950/50 border rounded-xl p-6 shadow-sm card-hover">
              <div className="bg-forest-100 dark:bg-forest-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Sprout className="h-6 w-6 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Crop Directory</h3>
              <p className="text-muted-foreground mb-4">
                Browse our comprehensive database of over 150 Indian crops with
                detailed information.
              </p>
              <Link to="/trends">
                <Button
                  variant="link"
                  className="px-0 flex items-center gap-1 text-green-700"
                >
                  <span>Explore crops</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
            <div className="bg-white dark:bg-forest-950/50 border rounded-xl p-6 shadow-sm card-hover">
              <div className="bg-forest-100 dark:bg-forest-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-green-700 " />
              </div>
              <h3 className="text-xl font-semibold mb-2">Market Prices</h3>
              <p className="text-muted-foreground mb-4">
                Get real-time price updates from major agricultural markets
                across India.
              </p>
              <Link to="/market">
                <Button
                  variant="link"
                  className="px-0 flex items-center gap-1 text-green-700"
                >
                  <span>Check prices</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
            <div className="bg-white dark:bg-forest-950/50 border rounded-xl p-6 shadow-sm card-hover">
              <div className="bg-forest-100 dark:bg-forest-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Insights</h3>
              <p className="text-muted-foreground mb-4">
                Receive data-driven recommendations and market forecasts for
                better decision making.
              </p>
              <Link to="/insights">
                <Button
                  variant="link"
                  className="px-0 flex items-center gap-1 text-green-700"
                >
                  <span>View insights</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
          <MarketInsights />
          {/* <SubscriptionBanner /> */}
          
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Index2;
