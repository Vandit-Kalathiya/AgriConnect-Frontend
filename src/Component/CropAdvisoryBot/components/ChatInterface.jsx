import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { ScrollArea } from "./ui/ScrollArea";
import {
  SendIcon,
  Loader2Icon,
  MapPinIcon,
  Trash2Icon,
  InfoIcon,
  LeafIcon,
  SunIcon,
  DropletIcon,
  PanelLeftIcon,
} from "lucide-react";
import { useToast } from "../Hooks/use-toast";
import { fetchCropRecommendationsByLocation } from "../lib/aiApi";
import { cn } from "../lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/Card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/Tooltip";
import { Badge } from "./ui/Badge";

const INITIAL_MESSAGE = `Welcome to the Crop Advisor! I can help you find the best crops to grow based on your location and current market trends in India.

To get started, please select your location using the location selector above.`;

// Function to generate bot responses for general queries
const generateBotResponse = (userInput, location) => {
  const input = userInput.toLowerCase();
  
  // Greetings
  if (input.match(/\b(hi|hello|hey|namaste)\b/)) {
    return "Hello! 👋 I'm your Crop Advisor. I can help you with crop recommendations, market trends, soil management, and farming tips for your region. How can I assist you today?";
  }
  
  // Market trends
  if (input.match(/\b(market|price|trend|rate|selling)\b/)) {
    return `For detailed market trends and current prices, please check the crop recommendations I've provided based on your location ${location ? `(${location.district}, ${location.state})` : ''}. Each crop card shows current market trends and projected price changes.`;
  }
  
  // Soil related
  if (input.match(/\b(soil|land|earth|fertility)\b/)) {
    return "For soil-specific tips and recommendations, please check the 'Soil & Weather Tips' tab above. I can provide information about:\n\n• Soil testing and analysis\n• Fertilizer recommendations\n• Soil pH management\n• Organic matter improvement\n• Drainage solutions";
  }
  
  // Weather related
  if (input.match(/\b(weather|rain|temperature|climate|season)\b/)) {
    return "Weather plays a crucial role in crop selection! The recommendations I've provided consider:\n\n• Local climate patterns\n• Seasonal rainfall\n• Temperature ranges\n• Growing seasons (Kharif/Rabi/Zaid)\n\nCheck the 'Soil & Weather Tips' tab for weather-based guidance.";
  }
  
  // Water/Irrigation
  if (input.match(/\b(water|irrigation|watering|drip|sprinkler)\b/)) {
    return "Water management is essential for successful farming! Each recommended crop shows water requirements:\n\n• Low: Drought-resistant crops\n• Medium: Moderate irrigation needed\n• High: Water-intensive crops\n\nConsider your water availability when selecting crops. I can provide specific irrigation tips for any crop you select.";
  }
  
  // Fertilizer
  if (input.match(/\b(fertilizer|manure|compost|nutrient)\b/)) {
    return "Proper fertilization is key to good yields! I recommend:\n\n• Get a soil test first\n• Use balanced NPK fertilizers\n• Consider organic alternatives\n• Follow crop-specific requirements\n• Apply at the right growth stages\n\nWould you like specific fertilizer recommendations for any particular crop?";
  }
  
  // Pests/Diseases
  if (input.match(/\b(pest|disease|insect|fungus|virus)\b/)) {
    return "Pest and disease management is crucial! Here are some tips:\n\n• Regular crop monitoring\n• Integrated Pest Management (IPM)\n• Crop rotation to break pest cycles\n• Use disease-resistant varieties\n• Proper spacing for air circulation\n\nFor specific pest problems, please mention the crop and symptoms you're seeing.";
  }
  
  // Government schemes
  if (input.match(/\b(scheme|subsidy|loan|government|pmkisan|pradhan mantri)\b/)) {
    return "Several government schemes can help farmers:\n\n• PM-KISAN: ₹6000/year direct benefit\n• PMFBY: Crop insurance scheme\n• PM-KUSUM: Solar pump subsidies\n• Soil Health Card Scheme\n• KCC: Kisan Credit Card for loans\n\nCheck with your local agriculture office for specific eligibility and application details.";
  }
  
  // Organic farming
  if (input.match(/\b(organic|natural|pesticide.free|chemical.free)\b/)) {
    return "Organic farming is gaining popularity! Benefits include:\n\n• Higher market prices\n• Better soil health long-term\n• Safer for environment\n• Growing consumer demand\n\nConsider getting organic certification for premium markets. Start with small areas and transition gradually.";
  }
  
  // ROI/Profit
  if (input.match(/\b(profit|roi|return|income|earning)\b/)) {
    return "Profitability depends on several factors:\n\n• Market prices at harvest time\n• Input costs (seeds, fertilizer, labor)\n• Yield per acre\n• Transportation costs\n• Weather conditions\n\nThe crop recommendations I've provided include estimated ROI percentages. Consider crops with higher scores for your conditions.";
  }
  
  // Harvest/Storage
  if (input.match(/\b(harvest|storage|store|godown)\b/)) {
    return "Proper harvesting and storage are vital:\n\n• Harvest at the right maturity\n• Use proper drying techniques\n• Maintain clean storage facilities\n• Control temperature and humidity\n• Protect from pests and rodents\n\nConsider cold storage for perishable crops to get better prices.";
  }
  
  // Location specific
  if (location && input.match(/\b(here|my.location|my.area|local)\b/)) {
    return `Based on your location in ${location.district}, ${location.state}, I've provided crop recommendations that are:\n\n• Suited to your local climate\n• Adaptable to regional soil types\n• In demand in nearby markets\n• Traditionally successful in your area\n\nCheck the recommended crops below for detailed information!`;
  }
  
  // Default response
  return `I can help you with:\n\n🌾 Crop recommendations for your region\n📊 Market trends and price analysis\n💧 Irrigation and water management\n🌱 Soil health and fertilization\n🐛 Pest and disease management\n💰 Government schemes and subsidies\n📈 Maximizing farm profitability\n\nPlease ask me a specific question, and I'll provide detailed guidance!`;
};

const ChatInterface = ({
  selectedLocation,
  onRecommendationsReceived,
  onToggleSidebar,
  sidebarOpen = false,
}) => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "bot",
      text: INITIAL_MESSAGE,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  // Use a ref so the callback never becomes a useEffect dependency
  const onRecommendationsRef = useRef(onRecommendationsReceived);
  useEffect(() => { onRecommendationsRef.current = onRecommendationsReceived; });
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLocationSelected = useCallback(async (location) => {
    setIsLoading(true);
    const newMessage = {
      id: Date.now().toString(),
      sender: "bot",
      text: `Analyzing agricultural conditions and market trends for ${location.district}, ${location.state} using AI service...`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const responseData = await fetchCropRecommendationsByLocation(location);

      const recommendedCrops = responseData.crops.map((crop, index) => ({
        ...crop,
        id: (index + 1).toString(),
      }));

      const cropList = recommendedCrops
        .map(
          (crop, index) =>
            `${index + 1}. **${crop.name}**: ${
              crop.suitabilityScore
            }% suitability`
        )
        .join("\n");

      const recommendationsMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: `Based on soil conditions, climate patterns, and current market trends in ${location.district}, ${location.state}, I recommend the following crops:

${cropList}

These recommendations consider current market prices, projected demand, and growing conditions in your region. Check the recommended crops section below for detailed information and price projections at harvest time.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, recommendationsMessage]);
      onRecommendationsRef.current?.(recommendedCrops);
    } catch (error) {
      console.error("Error getting crop recommendations:", error);

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: `I couldn't connect to the AI service for real-time analysis right now. Please try refreshing or ask me a specific question about crops, soil, or market trends for ${location.district}, ${location.state}.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  // Only re-create when location identity changes — ref keeps callback stable
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      handleLocationSelected(selectedLocation);
    }
  }, [selectedLocation, handleLocationSelected]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: generateBotResponse(input, selectedLocation),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
      inputRef.current?.focus();
    }, 1500);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        sender: "bot",
        text: INITIAL_MESSAGE,
        timestamp: new Date(),
      },
    ]);

    toast({
      title: "Chat Cleared",
      description: "All previous messages have been removed.",
      variant: "default",
    });
  };

  return (
    <Card className="flex flex-col h-[68vh] lg:h-[calc(100vh-220px)] overflow-hidden border border-green-100/80 shadow-md bg-gradient-to-b from-green-50 to-white rounded-2xl">
      <CardHeader className="sticky top-0 z-10 p-4 pb-2 flex flex-row items-center justify-between border-b border-green-100 bg-gradient-to-r from-green-100/95 to-green-50/95 backdrop-blur">
        <div className="flex items-center gap-3">
          {/* Improved Logo */}
          <div className="h-10 w-10 bg-green-500 rounded-full ring-2 ring-green-200 shadow-sm flex items-center justify-center">
            <LeafIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-green-800">
              Crop Advisor
            </CardTitle>
            <p className="text-xs text-green-600">Powered by AgriConnect</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {typeof onToggleSidebar === "function" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleSidebar}
                    className="h-8 w-8 text-green-700 hover:bg-green-100 hover:text-green-900 rounded-full"
                  >
                    <PanelLeftIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-green-800 text-white">
                  <p>{sidebarOpen ? "Hide history panel" : "Show history panel"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {selectedLocation && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 text-sm px-3 py-1 bg-green-100/80 text-green-800 border-green-200 hover:bg-green-200 transition-colors rounded-full"
                  >
                    <MapPinIcon className="h-3 w-3" />
                    <span>
                      {selectedLocation.district}, {selectedLocation.state}
                    </span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="bg-green-800 text-white">
                  <p>Your selected location</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  className="h-8 w-8 text-green-700 hover:bg-green-100 hover:text-green-900 rounded-full"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-green-800 text-white">
                <p>Clear conversation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-green-50/40 to-white">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex max-w-[85%] animate-fade-up",
                message.sender === "user" ? "ml-auto" : "mr-auto"
              )}
            >
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 shadow-sm",
                  message.sender === "user"
                    ? "bg-green-600 text-white"
                    : "bg-white border border-green-100"
                )}
              >
                {message.sender === "bot" && (
                  <div className="flex items-center gap-2 mb-2">
                    {/* Improved Bot Avatar */}
                    <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                      <LeafIcon className="h-3 w-3 text-green-700" />
                    </div>
                    <span className="text-xs font-medium text-green-700">
                      Crop Advisor
                    </span>
                  </div>
                )}
                <div className="whitespace-pre-line text-sm">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: message.text.replace(
                        /\*\*(.*?)\*\*/g,
                        "<strong class='text-green-800 font-bold'>$1</strong>"
                      ),
                    }}
                    className={message.sender === "user" ? "" : "text-gray-800"}
                  />
                </div>
                <div className="mt-1 text-xs opacity-70 flex items-center gap-1 justify-end">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex max-w-[85%] mr-auto animate-fade-up">
              <div className="rounded-2xl px-4 py-3 bg-white border border-green-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-green-600 rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-sm text-green-700">
                    Analyzing the data...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <CardFooter className="p-4 pt-2 border-t border-green-100 bg-green-50/80 flex flex-col gap-3">
        {/* Feature indicators moved above the input field */}
        <div className="w-full flex items-center justify-between mb-2 bg-white/50 rounded-lg py-2 px-4">
          <div className="flex items-center gap-2 text-xs text-green-600 transition-colors hover:text-green-800 cursor-pointer">
            <SunIcon className="h-4 w-4 text-amber-500" />
            <span>Weather-based tips</span>
          </div>
          <div className="h-4 w-px bg-green-100"></div>
          <div className="flex items-center gap-2 text-xs text-green-600 transition-colors hover:text-green-800 cursor-pointer">
            <DropletIcon className="h-4 w-4 text-blue-500" />
            <span>Irrigation advice</span>
          </div>
          <div className="h-4 w-px bg-green-100"></div>
          <div className="flex items-center gap-2 text-xs text-green-600 transition-colors hover:text-green-800 cursor-pointer">
            <InfoIcon className="h-4 w-4 text-green-500" />
            <span>Try asking about market trends</span>
          </div>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <div className="flex-1 relative rounded-full overflow-hidden">
            <Input
              ref={inputRef}
              placeholder="Ask about crop recommendations, market trends, or farming tips..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pr-24 pl-4 py-6 border-green-700 focus:border-green-400 shadow-sm bg-white placeholder:text-green-300 h-12 rounded-full"
              disabled={isLoading}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading || !input.trim()}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white shadow-sm rounded-full px-5 h-10 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="flex items-center justify-center">
                        <SendIcon className="h-4 w-4 mr-1" />
                        Send
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-green-800 text-white">
                  <p>Send your question</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
