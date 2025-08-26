import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Lightbulb, ArrowRight, Calendar, Filter, ChevronRight,
  ArrowUpRight, ArrowDownRight, Zap, BadgeAlert, BarChart3, 
  CloudRain, Sun, ThermometerSun
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Separator } from '../components/ui/Separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/Select';
import { generateRecommendations } from '../components/GeminiService';
import { toast } from 'sonner';

const Insights = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [insightType, setInsightType] = useState('all');
  const [timeframe, setTimeframe] = useState('upcoming');

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoadingRecommendations(true);
      try {
        const data = await generateRecommendations();
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        toast.error('Failed to load recommendations. Please try again.');
        setRecommendations([
          'Consider diversifying your crop portfolio to mitigate market risks, focusing on crops with stable demand.',
          'Watch for upcoming government subsidy programs for irrigation equipment - applications are expected to open next month.',
          'With the predicted above-average rainfall in central India, prepare adequate drainage systems to prevent water logging.'
        ]);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, []);

  const insightCards = [
    {
      title: 'Rice Export Ban Impact',
      content: 'The recent government restrictions on non-basmati rice exports are expected to stabilize domestic prices but could affect farmers in major rice-producing states.',
      date: '2 days ago',
      type: 'policy',
      icon: <BadgeAlert size={20} />,
      color: 'amber'
    },
    {
      title: 'Monsoon Forecast Update',
      content: 'Meteorological Department predicts above-normal monsoon rainfall across Central and Southern India, benefiting kharif crop cultivation.',
      date: '5 days ago',
      type: 'weather',
      icon: <CloudRain size={20} />,
      color: 'blue'
    },
    {
      title: 'Wheat Price Surge',
      content: 'Wheat prices have surged 8.5% over the past two weeks due to lower-than-expected production and increased export demand from neighboring countries.',
      date: '1 week ago',
      type: 'market',
      icon: <ArrowUpRight size={20} />,
      color: 'green'
    },
    {
      title: 'Vegetable Price Decline',
      content: 'Tomato and onion prices have fallen by 15-20% in major markets as new harvests arrive, providing relief to consumers and challenges for producers.',
      date: '1 week ago',
      type: 'market',
      icon: <ArrowDownRight size={20} />,
      color: 'red'
    },
    {
      title: 'New MSP Announced',
      content: 'Government announces 5-7% increase in Minimum Support Prices for kharif crops, including paddy, pulses, and oilseeds for the upcoming season.',
      date: '2 weeks ago',
      type: 'policy',
      icon: <Zap size={20} />,
      color: 'purple'
    },
    {
      title: 'Smart Irrigation Systems',
      content: 'New affordable IoT-based irrigation systems showing 30% water conservation in pilot projects across Maharashtra and Gujarat.',
      date: '3 weeks ago',
      type: 'technology',
      icon: <Lightbulb size={20} />,
      color: 'cyan'
    }
  ];

  const filteredInsights = insightCards.filter(insight => 
    insightType === 'all' ? true : insight.type === insightType
  );

  const forecastData = [
    { month: 'Jan', prediction: 85, actual: 87 },
    { month: 'Feb', prediction: 83, actual: 82 },
    { month: 'Mar', prediction: 80, actual: 78 },
    { month: 'Apr', prediction: 82, actual: 85 },
    { month: 'May', prediction: 86, actual: 88 },
    { month: 'Jun', prediction: 90, actual: 92 },
    { month: 'Jul', prediction: 94 },
    { month: 'Aug', prediction: 96 },
    { month: 'Sep', prediction: 93 },
    { month: 'Oct', prediction: 90 },
    { month: 'Nov', prediction: 88 },
    { month: 'Dec', prediction: 85 },
  ];

  const weatherPredictions = [
    {
      region: 'Northern India',
      rainfall: 'Normal (95-105% of LPA)',
      temperature: '1-2°C above normal',
      impact: 'neutral'
    },
    {
      region: 'Central India',
      rainfall: 'Above normal (>110% of LPA)',
      temperature: 'Normal',
      impact: 'positive'
    },
    {
      region: 'Southern India',
      rainfall: 'Above normal (>110% of LPA)',
      temperature: 'Normal',
      impact: 'positive'
    },
    {
      region: 'Eastern India',
      rainfall: 'Normal (95-105% of LPA)',
      temperature: 'Normal',
      impact: 'neutral'
    },
    {
      region: 'Western India',
      rainfall: 'Below normal (<90% of LPA)',
      temperature: '1-3°C above normal',
      impact: 'negative'
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden pt-20 pb-10 ml-5 mt-5">
      <div className="pl-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="text-primary" />
              <span>Agricultural Insights</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert analysis, predictions, and recommendations for Indian farmers
            </p>
          </div>
          <Card className="mb-8 border-green-50/20">
            <CardHeader className="bg-green-50 border-b border-green-50/20">
              <CardTitle className="flex items-center gap-2">
                <Zap className="text-primary h-5 w-5" />
                <span>AI-Powered Recommendations</span>
              </CardTitle>
              <CardDescription>
                Personalized insights based on current market conditions and seasonal factors
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isLoadingRecommendations ? (
                <div className="space-y-4">
                  <div className="h-6 rounded animate-pulse "></div>
                  <div className="h-6 rounded animate-pulse bg-green-50"></div>
                  <div className="h-6 rounded animate-pulse bg-green-50"></div>
                </div>
              ) : (
                <ul className="space-y-4">
                  {recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                        <ChevronRight size={16} className='bg-green-50 rounded-full p-1 text-lg' />
                      </div>
                      <p>{recommendation}</p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6 flex justify-end">
                <Button size="sm" className="bg-green-600 text-white hover:bg-green-700">
                  Get Customized Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-semibold">Market Insights</h2>
            <div className="flex gap-3">
              <Select value={insightType} onValueChange={setInsightType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Insights</SelectItem>
                  <SelectItem value="market">Market Trends</SelectItem>
                  <SelectItem value="policy">Policy Updates</SelectItem>
                  <SelectItem value="weather">Weather Impacts</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredInsights.map((insight, index) => (
              <Card key={index} className="card-hover overflow-hidden">
                <CardHeader className={`pb-2 border-b border-${insight.color}-100 dark:border-${insight.color}-900/30`}>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className={`text-${insight.color}-600 dark:text-${insight.color}-400`}>
                        {insight.icon}
                      </div>
                      <span>{insight.title}</span>
                    </CardTitle>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                      {insight.date}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-muted-foreground mb-4">{insight.content}</p>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-green-600">
                      <span>Read more</span>
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="chart-container">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Price Forecast Accuracy</span>
                </CardTitle>
                <CardDescription>
                  Comparison of predicted vs. actual rice prices (₹/kg)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={forecastData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis domain={[70, 100]} />
                      <Tooltip 
                        formatter={(value) => [`₹${value}/kg`, '']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="prediction" 
                        name="Predicted Price" 
                        stroke="#69a566" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        name="Actual Price" 
                        stroke="#0c9aea" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-3 bg-muted/40 rounded-lg text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="font-medium">Forecast Accuracy: 94.8%</span>
                  </div>
                  <p className="text-muted-foreground">
                    Our proprietary AI model has maintained above 90% accuracy in price predictions over the past 6 months.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="chart-container">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThermometerSun className="h-5 w-5 text-primary" />
                  <span>Seasonal Weather Predictions</span>
                </CardTitle>
                <CardDescription>
                  3-month outlook for major agricultural regions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weatherPredictions.map((prediction, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{prediction.region}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          prediction.impact === 'positive' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-800' 
                            : prediction.impact === 'negative'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-800'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-800'
                        }`}>
                          {prediction.impact === 'positive' 
                            ? 'Favorable' 
                            : prediction.impact === 'negative' 
                              ? 'Unfavorable' 
                              : 'Neutral'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1.5">
                          <CloudRain size={14} className="text-blue-600 dark:text-blue-400" />
                          <span className="text-muted-foreground">{prediction.rainfall}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Sun size={14} className="text-amber-600 dark:text-amber-400" />
                          <span className="text-muted-foreground">{prediction.temperature}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline" size="sm" className="bg-green-50">
                    View Detailed Weather Forecast
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Agricultural Events & Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-hover border-primary/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Kisan Mela 2023</CardTitle>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      Jul 15-17
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-muted-foreground mb-4">
                    Annual agricultural exhibition showcasing latest farming technologies, equipment, and techniques in New Delhi.
                  </p>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">Register</Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-hover border-primary/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">PM-Kisan Registration</CardTitle>
                    <span className="text-xs bg-green-100 text-green-800 dark:text-green-800 px-2 py-0.5 rounded-full">
                      Ongoing
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-muted-foreground mb-4">
                    Registration for the next installment of PM-Kisan Samman Nidhi is now open. Eligible farmers can apply through the official portal.
                  </p>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">Apply Now</Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-hover border-primary/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Crop Insurance Deadline</CardTitle>
                    <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-800 px-2 py-0.5 rounded-full">
                      Jul 31
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-muted-foreground mb-4">
                    Last date to enroll in the Pradhan Mantri Fasal Bima Yojana (PMFBY) for kharif crops is approaching. Don't miss this important deadline.
                  </p>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">Enroll Now</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* <Card className="bg-gradient-to-br from-forest-50 to-forest-100 dark:from-forest-900 dark:to-forest-950 border-0">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Stay Updated with Agricultural Insights
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Subscribe to receive personalized updates, market forecasts, and expert recommendations directly to your phone or email.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary rounded-full p-1.5">
                        <Calendar size={16} />
                      </div>
                      <span>Weekly market price updates</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary rounded-full p-1.5">
                        <Zap size={16} />
                      </div>
                      <span>Real-time policy announcements</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary rounded-full p-1.5">
                        <CloudRain size={16} />
                      </div>
                      <span>Weather alerts for your region</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button size="lg">
                      Subscribe Now
                    </Button>
                  </div>
                </div>
                <div className="hidden md:flex justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Farmer with smartphone" 
                    className="rounded-lg shadow-lg max-w-[300px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default Insights;