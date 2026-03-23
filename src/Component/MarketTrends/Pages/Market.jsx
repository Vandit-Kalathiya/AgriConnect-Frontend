import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  BarChart3, TrendingUp, ArrowRight, Wheat, Grape, Carrot, 
  Coffee, Filter, ArrowDownRight, ArrowUpRight, ChevronRight, 
  Clock, LayoutGrid
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import SearchBar from '../components/SearchBar';

const Market = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const marketsData = [
    { market: 'Azadpur Mandi', state: 'Delhi', type: 'APMC', todayPrice: 2540, yesterdayPrice: 2480, change: 2.4, volume: 12500 },
    { market: 'Vashi Market', state: 'Maharashtra', type: 'APMC', todayPrice: 2420, yesterdayPrice: 2450, change: -1.2, volume: 9800 },
    { market: 'Koyambedu Market', state: 'Tamil Nadu', type: 'APMC', todayPrice: 2380, yesterdayPrice: 2350, change: 1.3, volume: 8500 },
    { market: 'Bowenpally Market', state: 'Telangana', type: 'APMC', todayPrice: 2490, yesterdayPrice: 2520, change: -1.2, volume: 7200 },
    { market: 'INA Market', state: 'Delhi', type: 'Private', todayPrice: 2650, yesterdayPrice: 2600, change: 1.9, volume: 5400 },
    { market: 'Ghazipur Mandi', state: 'Uttar Pradesh', type: 'APMC', todayPrice: 2340, yesterdayPrice: 2280, change: 2.6, volume: 9200 },
    { market: 'Crawford Market', state: 'Maharashtra', type: 'Cooperative', todayPrice: 2580, yesterdayPrice: 2620, change: -1.5, volume: 6800 },
    { market: 'Besant Avenue', state: 'Karnataka', type: 'APMC', todayPrice: 2450, yesterdayPrice: 2390, change: 2.5, volume: 7500 },
    { market: 'Chandni Chowk', state: 'Delhi', type: 'Private', todayPrice: 2700, yesterdayPrice: 2750, change: -1.8, volume: 4200 },
    { market: 'Yelahanka Market', state: 'Karnataka', type: 'Cooperative', todayPrice: 2530, yesterdayPrice: 2480, change: 2.0, volume: 5800 },
  ];

  const topGainers = [
    { name: 'Green Chilli', price: 85, change: 18.5, category: 'Vegetables' },
    { name: 'Soybean', price: 4200, change: 12.3, category: 'Grains' },
    { name: 'Apple (Shimla)', price: 195, change: 10.8, category: 'Fruits' },
    { name: 'Black Pepper', price: 680, change: 9.6, category: 'Spices' },
    { name: 'Cotton', price: 6800, change: 8.2, category: 'Fibers' }
  ];

  const topLosers = [
    { name: 'Tomato', price: 28, change: -24.3, category: 'Vegetables' },
    { name: 'Onion', price: 22, change: -15.6, category: 'Vegetables' },
    { name: 'Mustard', price: 4800, change: -8.2, category: 'Oilseeds' },
    { name: 'Red Banana', price: 55, change: -7.5, category: 'Fruits' },
    { name: 'Maize', price: 1850, change: -5.1, category: 'Grains' }
  ];

  const stockLevels = [
    { name: 'Wheat', stock: 287, capacity: 350, fill: '#69a566' },
    { name: 'Rice', stock: 425, capacity: 500, fill: '#bb987e' },
    { name: 'Pulses', stock: 120, capacity: 200, fill: '#ac7f64' },
    { name: 'Sugar', stock: 95, capacity: 150, fill: '#0c9aea' },
  ];

  const filteredMarkets = marketsData.filter(market => {
    const matchesSearch = searchQuery.trim() === '' || 
      market.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = stateFilter === 'all' || market.state === stateFilter;
    return matchesSearch && matchesState;
  });

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="text-primary" />
            <span>Agricultural Markets</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Real-time price tracking across major agricultural markets in India
          </p>
        </div>
        <div className="mb-8">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="mb-4">
                  <label htmlFor="market-search" className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                    <Filter size={14} />
                    <span>Search Markets or Filter by State</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Input
                        id="market-search"
                        type="text"
                        placeholder="Search any market..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-8"
                      />
                    </div>
                    <Select value={stateFilter} onValueChange={setStateFilter}>
                      <SelectTrigger className="w-full sm:w-40 md:w-60">
                        <SelectValue placeholder="All States" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                        <SelectItem value="Telangana">Telangana</SelectItem>
                        <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant={viewMode === 'grid' ? 'default' : 'outline'} 
                        size="icon"
                        onClick={() => setViewMode('grid')}
                        aria-label="Grid view"
                      >
                        <LayoutGrid size={16} />
                      </Button>
                      <Button 
                        variant={viewMode === 'table' ? 'default' : 'outline'} 
                        size="icon"
                        onClick={() => setViewMode('table')}
                        aria-label="Table view"
                      >
                        <BarChart3 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Major Markets</h2>
            <div className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Clock size={14} />
              <span>Last updated: Today, 4:30 PM</span>
            </div>
          </div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMarkets.map((market, index) => (
                <Card key={index} className="card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{market.market}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <span>{market.state}</span>
                          <span className="text-xs px-1.5 py-0.5 bg-muted rounded-full">
                            {market.type}
                          </span>
                        </CardDescription>
                      </div>
                      <div 
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
                          ${market.change > 0 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                      >
                        {market.change > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(market.change).toFixed(1)}%
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Current Price:</span>
                      <span className="font-semibold">₹{market.todayPrice}/quintal</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-muted-foreground">Yesterday:</span>
                      <span>₹{market.yesterdayPrice}/quintal</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Volume:</span>
                      <span>{market.volume.toLocaleString()} tonnes</span>
                    </div>
                    <div className="mt-4 text-right">
                      <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                        View detailed prices
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Market</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Current Price</TableHead>
                        <TableHead>Yesterday</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMarkets.map((market, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{market.market}</TableCell>
                          <TableCell>{market.state}</TableCell>
                          <TableCell>
                            <span className="text-xs px-1.5 py-0.5 bg-muted rounded-full">
                              {market.type}
                            </span>
                          </TableCell>
                          <TableCell className="font-semibold">₹{market.todayPrice}/quintal</TableCell>
                          <TableCell>₹{market.yesterdayPrice}/quintal</TableCell>
                          <TableCell>
                            <span className={`flex items-center ${
                              market.change > 0 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {market.change > 0 ? 
                                <ArrowUpRight size={14} className="mr-1" /> : 
                                <ArrowDownRight size={14} className="mr-1" />}
                              {Math.abs(market.change).toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell>{market.volume.toLocaleString()} tonnes</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <ChevronRight size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
          {filteredMarkets.length === 0 && (
            <div className="text-center py-8 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">
                No markets found matching your search criteria. Please try another search term or filter.
              </p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span>Top Gainers</span>
              </CardTitle>
              <CardDescription>
                Crops with highest price increase today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topGainers.map((gainer, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-lg w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-800 dark:text-green-400">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{gainer.name}</div>
                        <div className="text-xs text-muted-foreground">{gainer.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{gainer.price}/kg</div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        +{gainer.change.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  View All Gainers
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span>Top Losers</span>
              </CardTitle>
              <CardDescription>
                Crops with highest price decrease today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topLosers.map((loser, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-lg w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-800 dark:text-red-400">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{loser.name}</div>
                        <div className="text-xs text-muted-foreground">{loser.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{loser.price}/kg</div>
                      <div className="text-sm text-red-600 dark:text-red-400">
                        {loser.change.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  View All Losers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mb-10 bg-gradient-to-br from-forest-50 to-forest-100 dark:from-forest-900 dark:to-forest-950 p-6 rounded-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Looking for a specific crop?</h2>
              <p className="text-muted-foreground mb-4">
                Search for any Indian crop to view detailed market data, price history, and forecasts.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Link to="/crop/rice" className="bg-white/80 dark:bg-white/10 border px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                  Rice
                </Link>
                <Link to="/crop/wheat" className="bg-white/80 dark:bg-white/10 border px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                  Wheat
                </Link>
                <Link to="/crop/tomato" className="bg-white/80 dark:bg-white/10 border px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                  Tomato
                </Link>
                <Link to="/crop/potato" className="bg-white/80 dark:bg-white/10 border px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                  Potato
                </Link>
                <Link to="/crop/onion" className="bg-white/80 dark:bg-white/10 border px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                  Onion
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-2/5">
              <SearchBar />
            </div>
          </div>
        </div>
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Government Storage Stock Levels</h2>
            <Button variant="outline" size="sm">
              View Storage Report
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="chart-container">
              <CardHeader>
                <CardTitle className="text-lg">Storage Fill Levels</CardTitle>
                <CardDescription>
                  Current stock as percentage of storage capacity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stockLevels}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} unit="%" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Storage Used']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey={(item) => (item.stock / item.capacity) * 100} 
                        name="Fill Level"
                        radius={[0, 4, 4, 0]}
                        barSize={24}
                      >
                        {stockLevels.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="chart-container">
              <CardHeader>
                <CardTitle className="text-lg">Storage Details</CardTitle>
                <CardDescription>
                  Current stock levels in major government warehouses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Crop</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Fill Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockLevels.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.stock.toLocaleString()} tonnes</TableCell>
                        <TableCell>{item.capacity.toLocaleString()} tonnes</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="h-2 rounded-full" 
                                style={{ 
                                  width: `${(item.stock / item.capacity) * 100}%`,
                                  backgroundColor: item.fill 
                                }}
                              ></div>
                            </div>
                            <span className="text-xs whitespace-nowrap">{((item.stock / item.capacity) * 100).toFixed(0)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 p-3 bg-muted/40 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/10 text-primary rounded-full p-1 mt-0.5 flex-shrink-0">
                      <ChevronRight size={14} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Government procurement for the kharif season is ongoing. Storage levels are expected to increase by 15-20% in the next month.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/category/grains" className="card-hover">
              <Card className="overflow-hidden">
                <div 
                  className="h-40 bg-center bg-cover" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1574323347407-f5e1c1135df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')` }}
                ></div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wheat className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Grains & Cereals</h3>
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/category/fruits" className="card-hover">
              <Card className="overflow-hidden">
                <div 
                  className="h-40 bg-center bg-cover" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')` }}
                ></div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Grape className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Fruits</h3>
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/category/vegetables" className="card-hover">
              <Card className="overflow-hidden">
                <div 
                  className="h-40 bg-center bg-cover" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')` }}
                ></div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Carrot className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Vegetables</h3>
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/category/spices" className="card-hover">
              <Card className="overflow-hidden">
                <div 
                  className="h-40 bg-center bg-cover" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1532336414038-cf19250c5757?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')` }}
                ></div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coffee className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Spices</h3>
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;