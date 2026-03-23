import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { 
  TrendingUp, BarChart3, ArrowUpRight, Filter, ArrowRight,
  Layers, Calendar, Wheat, Carrot, Grape, Coffee
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Input } from '../components/ui/Input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/Select';
import TrendingCrops from '../components/TrendingCrops';

const Trends = () => {
  const [yearFilter, setYearFilter] = useState('2023');
  const [stateFilter, setStateFilter] = useState('all');

  const categoryData = [
    { name: 'Grains', value: 35, trend: 'up', percentage: 8.2, color: '#69a566' },
    { name: 'Vegetables', value: 25, trend: 'down', percentage: -3.5, color: '#ac7f64' },
    { name: 'Fruits', value: 20, trend: 'up', percentage: 5.1, color: '#bb987e' },
    { name: 'Spices', value: 12, trend: 'stable', percentage: 0.8, color: '#0c9aea' },
    { name: 'Others', value: 8, trend: 'down', percentage: -1.2, color: '#9d7058' },
  ];

  const monthlyData = [
    { month: 'Jan', grains: 100, fruits: 95, vegetables: 105, spices: 110 },
    { month: 'Feb', grains: 102, fruits: 98, vegetables: 103, spices: 112 },
    { month: 'Mar', grains: 105, fruits: 102, vegetables: 98, spices: 115 },
    { month: 'Apr', grains: 108, fruits: 106, vegetables: 95, spices: 118 },
    { month: 'May', grains: 110, fruits: 110, vegetables: 98, spices: 120 },
    { month: 'Jun', grains: 112, fruits: 115, vegetables: 102, spices: 118 },
    { month: 'Jul', grains: 115, fruits: 118, vegetables: 108, spices: 115 },
    { month: 'Aug', grains: 118, fruits: 115, vegetables: 112, spices: 114 },
    { month: 'Sep', grains: 120, fruits: 112, vegetables: 118, spices: 116 },
    { month: 'Oct', grains: 118, fruits: 108, vegetables: 120, spices: 118 },
    { month: 'Nov', grains: 115, fruits: 105, vegetables: 118, spices: 120 },
    { month: 'Dec', grains: 112, fruits: 102, vegetables: 115, spices: 125 },
  ];

  const trendingStates = [
    { name: 'Maharashtra', value: 28500, percentage: 12.5 },
    { name: 'Punjab', value: 24200, percentage: 8.3 },
    { name: 'Uttar Pradesh', value: 22800, percentage: 7.1 },
    { name: 'Karnataka', value: 18900, percentage: 6.2 },
    { name: 'Gujarat', value: 17500, percentage: 5.8 },
  ];

  const seasonalCrops = [
    { name: 'Rabi Crops', percentage: 15.2, positive: true },
    { name: 'Kharif Crops', percentage: 8.7, positive: true },
    { name: 'Zaid Crops', percentage: -3.4, positive: false },
    { name: 'Plantation Crops', percentage: 5.1, positive: true },
  ];

  return (
    <div className="min-h-screen max-w-screen overflow-x-hidden pt-20 pb-12 mt-5">
      <div className="pl-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="text-green-600" />
              <span>Market Trends & Analysis</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive analysis of agricultural market trends across India
            </p>
          </div>
          <div className="bg-card border rounded-lg p-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label htmlFor="search" className="text-sm font-medium flex items-center gap-1.5">
                  <Filter size={14} />
                  <span>Filter Trends</span>
                </label>
                <div className="flex gap-3">
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={stateFilter} onValueChange={setStateFilter}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="punjab">Punjab</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="up">Uttar Pradesh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="bg-green-600 text-white hover:bg-green-700">Apply Filters</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <Card className="chart-container">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Crop Category Distribution
                </CardTitle>
                <CardDescription>
                  Market share by crop category (% of total volume)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Market Share']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm">{category.name}</span>
                      <span className={`text-xs font-medium ${
                        category.trend === 'up' 
                          ? 'text-green-600 dark:text-green-400' 
                          : category.trend === 'down' 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {category.trend === 'up' ? '↑' : category.trend === 'down' ? '↓' : '→'}
                        {Math.abs(category.percentage).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="chart-container">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Monthly Price Index Trends
                </CardTitle>
                <CardDescription>
                  Price index change by crop category (Base: Jan 2023 = 100)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis domain={[90, 130]} />
                      <Tooltip 
                        formatter={(value) => [`${value} points`, '']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="grains" 
                        name="Grains" 
                        stroke="#69a566" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="fruits" 
                        name="Fruits" 
                        stroke="#bb987e" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="vegetables" 
                        name="Vegetables" 
                        stroke="#ac7f64" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="spices" 
                        name="Spices" 
                        stroke="#0c9aea" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link to="/insights">
                    <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                      <span>View detailed analysis</span> 
                      <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <Card className="chart-container">
              <CardHeader>
                <CardTitle className="text-lg">Top Producing States</CardTitle>
                <CardDescription>
                  States with highest agricultural output
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={trendingStates}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip 
                        formatter={(value) => [`${Number(value).toLocaleString()} crores`, 'Production Value']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#69a566" 
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="chart-container">
              <CardHeader>
                <CardTitle className="text-lg">Seasonal Crop Performance</CardTitle>
                <CardDescription>
                  Year-over-year growth by crop season
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-2">
                  {seasonalCrops.map((crop, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{crop.name}</span>
                        <span className={`text-sm font-medium ${crop.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {crop.positive ? '+' : ''}{crop.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`${crop.positive ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`} 
                          style={{ width: `${Math.min(Math.abs(crop.percentage) * 5, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-3 bg-muted/50 rounded-lg text-sm">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span className="font-medium">Seasonal Crop Calendar</span>
                  </div>
                  <ul className="space-y-1 pl-3">
                    <li className="flex items-center gap-1.5">
                      <Wheat size={14} className="text-primary" />
                      <span>Rabi: October to March</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Carrot size={14} className="text-primary" />
                      <span>Kharif: June to October</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Grape size={14} className="text-primary" />
                      <span>Zaid: March to June</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Coffee size={14} className="text-primary" />
                      <span>Plantation: Year-round</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Card className="chart-container">
              <CardHeader>
                <CardTitle className="text-lg">Key Trend Highlights</CardTitle>
                <CardDescription>
                  Notable market developments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-600 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-500 dark:text-green-700 font-medium mb-1">
                      <ArrowUpRight size={16} />
                      <span>Increasing Export Demand</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Indian spice exports have risen by 18% compared to last year, driven by increased global demand.
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-600 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-800 font-medium mb-1">
                      <BarChart3 size={16} />
                      <span>Price Stabilization</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Government interventions have helped stabilize prices for essential food grains in major markets.
                    </p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-800 font-medium mb-1">
                      <TrendingUp size={16} />
                      <span>Organic Produce Growth</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Organic fruit and vegetable market has expanded by 22% annually, indicating shifting consumer preferences.
                    </p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Link to="/insights">
                    <Button variant="outline" size="sm">
                      View All Insights
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mb-8">
            <TrendingCrops />
          </div>
          {/* <Card className="bg-gradient-to-br from-forest-50 to-forest-100 dark:from-forest-900 dark:to-forest-950 border-0 mb-6">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">
                    Download Comprehensive Market Report
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Get our detailed quarterly agricultural market analysis with insights, forecasts, and recommendations.
                  </p>
                  <Button size="lg">
                    Download Report
                  </Button>
                </div>
                <div className="w-full md:w-1/3 flex justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Agricultural report" 
                    className="rounded-lg shadow-lg max-w-[200px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card> */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-green-50/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">How are trend forecasts calculated?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our forecasts use historical data patterns, current market conditions, weather predictions, and agricultural policy changes analyzed through advanced AI algorithms.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-green-50/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">How often is market data updated?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Market data is updated daily from agricultural markets across India, with trend analysis refreshed weekly and comprehensive reports issued monthly.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-green-50/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">What data sources do you use?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We consolidate data from government APMCs, commodity exchanges, meteorological departments, and direct market surveys across agricultural centers.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-green-50/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Can I get region-specific insights?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, you can filter market data by state and region to get localized insights and price trends relevant to your specific location.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;