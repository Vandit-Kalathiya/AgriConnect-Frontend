import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Badge } from '../components/ui/Badge';
import { ArrowUpRight, ArrowDownRight, Percent, Clock } from 'lucide-react';
import { getCurrentMonth, getCurrentYear } from '../Utils/DateUtils';

const CurrentMonthHighlights = () => {
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();
  const [isLoading, setIsLoading] = useState(true);
  const [highlights, setHighlights] = useState([]);
  const [marketShare, setMarketShare] = useState([]);
  
  const COLORS = ['#69a566', '#ac7f64', '#f97316', '#0ea5e9', '#8b5cf6'];
  
  useEffect(() => {
    const fetchCurrentMonthData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockHighlights = [
          {
            category: 'Rice',
            value: 38.5,
            change: 4.8,
            unit: 'million tons'
          },
          {
            category: 'Wheat',
            value: 12.8,
            change: -2.3,
            unit: 'million tons'
          },
          {
            category: 'Pulses',
            value: 8.4,
            change: 5.2,
            unit: 'million tons'
          },
          {
            category: 'Vegetables',
            value: 45.6,
            change: 7.1,
            unit: 'million tons'
          },
          {
            category: 'Fruits',
            value: 28.9,
            change: 3.5,
            unit: 'million tons'
          }
        ];
        
        const mockMarketShare = [
          { name: 'Rice', value: 35 },
          { name: 'Wheat', value: 22 },
          { name: 'Vegetables', value: 18 },
          { name: 'Fruits', value: 15 },
          { name: 'Others', value: 10 }
        ];
        
        setHighlights(mockHighlights);
        setMarketShare(mockMarketShare);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching current month data:', error);
        setIsLoading(false);
      }
    };
    
    fetchCurrentMonthData();
  }, []);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-[300px] bg-muted rounded animate-pulse"></div>
            <div className="h-[300px] bg-muted rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <CardTitle>{currentMonth} {currentYear} Market Highlights</CardTitle>
        </div>
        <CardDescription>Current month's agricultural production and market share analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-4">Current Month Production (with YoY change)</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={highlights}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name, props) => {
                      if (name === 'value') {
                        return [`${value} ${props.payload.unit}`, 'Production'];
                      }
                      return [value, name];
                    }}
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
                    radius={[4, 4, 0, 0]} 
                    label={({ x, y, width, value, index }) => {
                      const item = highlights[index];
                      return (
                        <g>
                          <text
                            x={x + width / 2}
                            y={y - 15}
                            fill={item.change >= 0 ? "#16a34a" : "#dc2626"}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize={12}
                            fontWeight={500}
                          >
                            {item.change >= 0 ? "↑" : "↓"}{Math.abs(item.change)}%
                          </text>
                        </g>
                      );
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-4">Market Share by Crop Category</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marketShare}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {marketShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {highlights.map((item) => (
            <Card key={item.category} className="bg-muted/30">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium mb-1">{item.category}</h4>
                <div className="text-2xl font-bold mb-1">
                  {item.value} <span className="text-sm font-normal">{item.unit.split(' ')[0]}</span>
                </div>
                <Badge variant={item.change >= 0 ? "outline" : "destructive"} className="flex items-center w-fit gap-1">
                  {item.change >= 0 ? (
                    <ArrowUpRight size={14} className="text-green-600" />
                  ) : (
                    <ArrowDownRight size={14} className="text-red-600" />
                  )}
                  <span>{Math.abs(item.change)}%</span>
                  <Percent size={10} />
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentMonthHighlights;