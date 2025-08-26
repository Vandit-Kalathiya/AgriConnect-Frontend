import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChevronRight, AlertTriangle, TrendingUp, TrendingDown, Leaf, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/Dialog';
import { useNavigate } from 'react-router-dom';

const marketStats = [
  {
    title: "Total Market Volume",
    value: "143,250",
    unit: "Tons",
    change: "+5.2%",
    isPositive: true
  },
  {
    title: "Avg. Price Change",
    value: "+3.8%",
    unit: "Weekly",
    change: "+0.6%",
    isPositive: true
  },
  {
    title: "Active Markets",
    value: "1,248",
    unit: "APMCs",
    change: "+12",
    isPositive: true
  },
  {
    title: "Farmer Registrations",
    value: "82,305",
    unit: "Sellers",
    change: "+4.9%",
    isPositive: true
  }
];

const priceHistoryData = [
  { month: 'Jul', Rice: 84, Wheat: 30, Potato: 19, Tomato: 38 },
  { month: 'Aug', Rice: 82, Wheat: 31, Potato: 20, Tomato: 42 },
  { month: 'Sep', Rice: 80, Wheat: 32, Potato: 22, Tomato: 45 },
  { month: 'Oct', Rice: 79, Wheat: 32, Potato: 20, Tomato: 40 },
  { month: 'Nov', Rice: 78, Wheat: 31, Potato: 19, Tomato: 36 },
  { month: 'Dec', Rice: 80, Wheat: 32, Potato: 18, Tomato: 32 },
  { month: 'Jan', Rice: 83, Wheat: 32, Potato: 17, Tomato: 30 },
  { month: 'Feb', Rice: 85, Wheat: 31, Potato: 18, Tomato: 28 },
  { month: 'Mar', Rice: 84, Wheat: 30, Potato: 19, Tomato: 32 },
  { month: 'Apr', Rice: 82, Wheat: 31, Potato: 18, Tomato: 34 },
  { month: 'May', Rice: 85, Wheat: 32, Potato: 19, Tomato: 35 },
  { month: 'Jun', Rice: 90, Wheat: 33, Potato: 19.5, Tomato: 35 },
];

const priceForecastData = [
  { month: 'Jul', Rice: 90, Wheat: 33, Potato: 19.5, Tomato: 35 },
  { month: 'Aug', Rice: 88, Wheat: 34, Potato: 20, Tomato: 38 },
  { month: 'Sep', Rice: 86, Wheat: 35, Potato: 21, Tomato: 40 },
  { month: 'Oct', Rice: 85, Wheat: 35, Potato: 22, Tomato: 42 },
  { month: 'Nov', Rice: 84, Wheat: 34, Potato: 20, Tomato: 38 },
  { month: 'Dec', Rice: 86, Wheat: 33, Potato: 19, Tomato: 34 },
];

const recommendations = [
  {
    type: "positive",
    title: "Rice Prices Expected to Stabilize",
    content: "After the recent price surge, rice prices are expected to stabilize in the coming months as new harvests reach the market. Consider gradual selling rather than holding inventory.",
    icon: <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
  },
  {
    type: "warning",
    title: "Tomato Prices Volatile Due to Unseasonal Rains",
    content: "Recent unseasonal rains in Maharashtra and Karnataka have affected tomato crops, leading to price volatility. Consider diversifying crops or using protective farming methods.",
    icon: <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400" />
  },
  {
    type: "positive",
    title: "Government MSP Increase for Wheat",
    content: "The government has announced a 3.5% increase in Minimum Support Price (MSP) for wheat, effective from the next procurement season. Plan your wheat crops accordingly.",
    icon: <Leaf size={20} className="text-green-600 dark:text-green-400" />
  }
];

const MarketInsights = () => {
  const [selectedCrop, setSelectedCrop] = useState('Rice');
  const [showRegionalDialog, setShowRegionalDialog] = useState(false);
  const navigate = useNavigate();
  
  const cropColors = {
    Rice: '#69a566',
    Wheat: '#ac7f64',
    Potato: '#bb987e',
    Tomato: '#e24c4c'
  };

  const handleViewDetailedAnalysis = () => {
    const cropSlug = selectedCrop.toLowerCase();
    navigate(`/crop/${cropSlug}`);
  };

  return (
    <div className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {marketStats.map((stat, index) => (
            <Card key={index} className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-muted-foreground">{stat.unit}</span>
                  <span className={`text-sm font-medium ${stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Market Recommendations</CardTitle>
            <CardDescription>Based on current trends and forecasts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className={`recommendation-card ${rec.type} bg-green-50 py-2 px-4 rounded-lg`}>
                {rec.icon}
                <div>
                  <h4 className="font-medium mb-1">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">{rec.content}</p>
                </div>
              </div>
            ))}
            <Button variant="link" className="pl-0 flex items-center gap-1">
              View all recommendations <ChevronRight size={16} />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 chart-container">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl">Crop Price Analysis</CardTitle>
              <CardDescription>
                Historical data and price forecasts for major crops
              </CardDescription>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(cropColors).map(crop => (
                <Button 
                  key={crop}
                  variant={selectedCrop === crop ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCrop(crop)}
                >
                  {crop}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="history">
            <TabsList className="mb-4">
              <TabsTrigger value="history">Price History (Last 12 Months)</TabsTrigger>
              <TabsTrigger value="forecast">Price Forecast (Next 6 Months)</TabsTrigger>
            </TabsList>
            <TabsContent value="history" className="mt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={priceHistoryData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`₹${value}/kg`, selectedCrop]}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={selectedCrop} 
                      stroke={cropColors[selectedCrop]} 
                      strokeWidth={3}
                      dot={{ r: 4, fill: cropColors[selectedCrop] }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="forecast" className="mt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={priceForecastData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`₹${value}/kg (Forecast)`, selectedCrop]}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={selectedCrop} 
                      stroke={cropColors[selectedCrop]} 
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: cropColors[selectedCrop] }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-secondary/50 rounded-lg border border-secondary text-sm text-secondary-foreground">
                <p className="flex items-start gap-2">
                  <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Forecasts are based on historical data patterns, government policies, and weather predictions. Actual prices may vary based on market conditions.</span>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="text-xl">Regional Market Price Comparison</CardTitle>
          <CardDescription>
            Current {selectedCrop} prices across major agricultural markets in India
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { region: 'Delhi', price: selectedCrop === 'Rice' ? 92 : selectedCrop === 'Wheat' ? 34 : selectedCrop === 'Potato' ? 21 : 36 },
                  { region: 'Mumbai', price: selectedCrop === 'Rice' ? 88 : selectedCrop === 'Wheat' ? 35 : selectedCrop === 'Potato' ? 23 : 39 },
                  { region: 'Chennai', price: selectedCrop === 'Rice' ? 84 : selectedCrop === 'Wheat' ? 36 : selectedCrop === 'Potato' ? 19 : 38 },
                  { region: 'Kolkata', price: selectedCrop === 'Rice' ? 86 : selectedCrop === 'Wheat' ? 33 : selectedCrop === 'Potato' ? 18 : 34 },
                  { region: 'Bangalore', price: selectedCrop === 'Rice' ? 90 : selectedCrop === 'Wheat' ? 35 : selectedCrop === 'Potato' ? 22 : 40 },
                  { region: 'Hyderabad', price: selectedCrop === 'Rice' ? 85 : selectedCrop === 'Wheat' ? 34 : selectedCrop === 'Potato' ? 20 : 37 },
                  { region: 'Ahmedabad', price: selectedCrop === 'Rice' ? 87 : selectedCrop === 'Wheat' ? 32 : selectedCrop === 'Potato' ? 19 : 35 },
                  { region: 'Lucknow', price: selectedCrop === 'Rice' ? 82 : selectedCrop === 'Wheat' ? 30 : selectedCrop === 'Potato' ? 17 : 33 },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₹${value}/kg`, 'Price']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="price" 
                  fill={cropColors[selectedCrop]} 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-6">
            <Button 
              className="flex items-center gap-2 bg-green-700 text-white" 
              onClick={handleViewDetailedAnalysis}
            >
              <span>View detailed regional analysis</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showRegionalDialog} onOpenChange={setShowRegionalDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Regional Market Analysis for {selectedCrop}</DialogTitle>
            <DialogDescription>
              Detailed price comparison across major agricultural markets in India
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="h-[400px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={[
                    { region: 'Delhi', price: selectedCrop === 'Rice' ? 92 : selectedCrop === 'Wheat' ? 34 : selectedCrop === 'Potato' ? 21 : 36 },
                    { region: 'Mumbai', price: selectedCrop === 'Rice' ? 88 : selectedCrop === 'Wheat' ? 35 : selectedCrop === 'Potato' ? 23 : 39 },
                    { region: 'Chennai', price: selectedCrop === 'Rice' ? 84 : selectedCrop === 'Wheat' ? 36 : selectedCrop === 'Potato' ? 19 : 38 },
                    { region: 'Kolkata', price: selectedCrop === 'Rice' ? 86 : selectedCrop === 'Wheat' ? 33 : selectedCrop === 'Potato' ? 18 : 34 },
                    { region: 'Bangalore', price: selectedCrop === 'Rice' ? 90 : selectedCrop === 'Wheat' ? 35 : selectedCrop === 'Potato' ? 22 : 40 },
                    { region: 'Hyderabad', price: selectedCrop === 'Rice' ? 85 : selectedCrop === 'Wheat' ? 34 : selectedCrop === 'Potato' ? 20 : 37 },
                    { region: 'Ahmedabad', price: selectedCrop === 'Rice' ? 87 : selectedCrop === 'Wheat' ? 32 : selectedCrop === 'Potato' ? 19 : 35 },
                    { region: 'Lucknow', price: selectedCrop === 'Rice' ? 82 : selectedCrop === 'Wheat' ? 30 : selectedCrop === 'Potato' ? 17 : 33 },
                  ].sort((a, b) => b.price - a.price)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" domain={[0, 'dataMax + 10']} />
                  <YAxis dataKey="region" type="category" width={100} />
                  <Tooltip 
                    formatter={(value) => [`₹${value}/kg`, 'Current Price']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="price" 
                    fill={cropColors[selectedCrop]} 
                    radius={[0, 4, 4, 0]}
                    label={{ position: 'right', formatter: (value) => `₹${value}` }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <Button onClick={() => navigate(`/crop/${selectedCrop.toLowerCase()}`)} className="w-full">
              View Full Analysis for {selectedCrop}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketInsights;