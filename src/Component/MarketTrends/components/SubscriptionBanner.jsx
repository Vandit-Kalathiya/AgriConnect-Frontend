import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Bell, Zap, Calendar, MessageSquare, Check, Star, Map, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

const SubscriptionBanner = () => {
  const [email, setEmail] = useState('');
  const [subscriptionMode, setSubscriptionMode] = useState('newsletter');
  const location = useLocation();
  
  const isCropDetailPage = location.pathname.includes('/crop/');

  if (isCropDetailPage) {
    return (
      <div className="my-10">
        <Card className="border-primary/20 bg-gradient-to-br from-forest-50 to-forest-100 dark:from-forest-950 dark:to-forest-900">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-2xl font-bold mb-4">Explore More Agricultural Resources</h3>
                <p className="text-muted-foreground mb-6">
                  Use these tools to get the most out of your farming operations and stay informed about the market.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-forest-950/50 rounded-lg p-4 shadow-sm">
                    <div className="flex gap-3 items-start">
                      <div className="bg-primary/10 text-primary rounded-full p-2">
                        <Map size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Regional Weather Forecast</h4>
                        <p className="text-sm text-muted-foreground">Get 7-day weather predictions for your area to plan farm activities</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-forest-950/50 rounded-lg p-4 shadow-sm">
                    <div className="flex gap-3 items-start">
                      <div className="bg-primary/10 text-primary rounded-full p-2">
                        <BarChart3 size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Price History Tool</h4>
                        <p className="text-sm text-muted-foreground">Analyze 5-year price trends to identify seasonal patterns</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-forest-950/50 rounded-lg p-4 shadow-sm">
                    <div className="flex gap-3 items-start">
                      <div className="bg-primary/10 text-primary rounded-full p-2">
                        <Zap size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Smart Profit Calculator</h4>
                        <p className="text-sm text-muted-foreground">Estimate your crop profit margin based on current prices</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-forest-950/50 rounded-lg p-4 shadow-sm">
                    <div className="flex gap-3 items-start">
                      <div className="bg-primary/10 text-primary rounded-full p-2">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Crop Calendar</h4>
                        <p className="text-sm text-muted-foreground">View optimal planting and harvesting times for your crops</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Digital farming tools" 
                  className="rounded-lg shadow-lg h-full object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const plans = [
    {
      name: 'Basic',
      price: '₹0',
      period: 'Free forever',
      features: [
        'Daily price updates',
        'Basic crop information',
        'Limited market insights',
        'Web access only'
      ]
    },
    {
      name: 'Kisan Premium',
      price: '₹99',
      period: 'per month',
      features: [
        'Real-time price alerts',
        'Personalized crop recommendations',
        'Advanced market predictions',
        'Priority customer support',
        'SMS & WhatsApp notifications'
      ],
      highlight: true
    },
    {
      name: 'Mandi Pro',
      price: '₹899',
      period: 'per year',
      features: [
        'Everything in Kisan Premium',
        'Advanced export market data',
        'Direct connection with buyers',
        'Seasonal profit forecasting',
        'Regional expert consultations'
      ]
    }
  ];

  const handleNewsletter = () => {
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    toast.success('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  const handleSubscription = (plan) => {
    toast.success(`You selected the ${plan} plan. Redirecting to payment...`);
  };

  return (
    <div className="my-10">
      <Tabs value={subscriptionMode} onValueChange={(v) => setSubscriptionMode(v)}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="newsletter" className="flex items-center gap-2">
            <Bell size={16} />
            <span>Free Updates</span>
          </TabsTrigger>
          <TabsTrigger value="premium" className="flex items-center gap-2">
            <Star size={16} />
            <span>Premium Plans</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="newsletter">
          <Card className="border-primary/20 bg-gradient-to-br from-forest-50 to-forest-100 dark:from-forest-950 dark:to-forest-900">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Stay Updated with Crop Market Alerts</h3>
                  <p className="text-muted-foreground mb-6">
                    Get personalized price alerts, weather updates, and market insights directly to your inbox or phone.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary rounded-full p-1.5">
                        <Calendar size={16} />
                      </div>
                      <span>Weekly price trend summaries</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary rounded-full p-1.5">
                        <Zap size={16} />
                      </div>
                      <span>Instant policy change notifications</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary rounded-full p-1.5">
                        <MessageSquare size={16} />
                      </div>
                      <span>SMS alerts for your chosen crops</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input 
                      type="email" 
                      placeholder="Enter your email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/80 dark:bg-forest-900/80"
                    />
                    <Button onClick={handleNewsletter}>Subscribe</Button>
                  </div>
                </div>
                
                <div className="hidden md:block">
                  <img 
                    src="https://images.unsplash.com/photo-1595315343181-ab8cc3c858a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Farmer checking mobile phone" 
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="premium">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`overflow-hidden ${plan.highlight ? 'border-primary/40 ring-1 ring-primary/30 shadow-lg' : ''}`}
              >
                {plan.highlight && (
                  <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardContent className={`p-6 ${plan.highlight ? 'pt-4' : 'pt-6'}`}>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-4 mb-6">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check size={18} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => handleSubscription(plan.name)}
                    className="w-full" 
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    {plan.name === 'Basic' ? 'Current Plan' : 'Subscribe Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionBanner;