import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { useToast } from "../Hooks/use-toast";
import GeminiApiKeyInput from "./GeminiApiKeyInput";
import { generateCropRecommendations } from "../lib/geminiApi";
import { cn } from "../lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/Card";
import { Avatar } from "./ui/Avtar";
import { Separator } from "./ui/Separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/Tooltip";
import { Badge } from "./ui/Badge";

const INITIAL_MESSAGE = `Welcome to the Crop Advisor! I can help you find the best crops to grow based on your location and current market trends in India.

To get started, please select your location using the location selector above.`;

const ChatInterface = ({ selectedLocation, onRecommendationsReceived }) => {
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
  const [geminiApiKey, setGeminiApiKey] = useState(
    "AIzaSyDU7xQMNUiyJ9SEtvDQCd3jmpgfTGo9kg8"
  );
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedLocation && geminiApiKey) {
      handleLocationSelected(selectedLocation);
    } else if (selectedLocation && !geminiApiKey) {
      const newMessage = {
        id: Date.now().toString(),
        sender: "bot",
        text: `Please enter your Gemini API key below to receive personalized crop recommendations for ${selectedLocation.district}, ${selectedLocation.state}.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
    }
  }, [selectedLocation, geminiApiKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleApiKeySet = (key) => {
    setGeminiApiKey(key);
    toast({
      title: "API Key Set",
      description: "Your Gemini API key has been saved for this session.",
      variant: "success",
    });

    if (selectedLocation) {
      handleLocationSelected(selectedLocation);
    }
  };

  const handleLocationSelected = async (location) => {
    if (!geminiApiKey) {
      return;
    }

    setIsLoading(true);
    const newMessage = {
      id: Date.now().toString(),
      sender: "bot",
      text: `Analyzing agricultural conditions and market trends for ${location.district}, ${location.state} using Gemini AI...`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const responseData = await generateCropRecommendations(location);

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
      onRecommendationsReceived(recommendedCrops);
    } catch (error) {
      console.error("Error getting crop recommendations:", error);

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: `Sorry, I encountered an error while trying to get crop recommendations. Please check your Gemini API key and try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);

      toast({
        title: "Error",
        description:
          "Failed to get crop recommendations from Gemini API. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    <Card className="flex flex-col h-[550px] overflow-hidden border border-green-100 shadow-lg bg-gradient-to-b from-green-50 to-white rounded-xl">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-green-100 bg-gradient-to-r from-green-100 to-green-50">
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

      <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-green-50/50 to-white">
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

      {!geminiApiKey && (
        <div className="p-4 border-t border-green-100 bg-green-50">
          <GeminiApiKeyInput onApiKeySet={handleApiKeySet} />
        </div>
      )}

      <CardFooter className="p-4 pt-2 border-t border-green-100 bg-green-50 flex flex-col gap-3">
        {/* Feature indicators moved above the input field */}
        {geminiApiKey && (
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
        )}

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <div className="flex-1 relative rounded-full overflow-hidden">
            <Input
              ref={inputRef}
              placeholder="Ask about crop recommendations, market trends, or farming tips..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pr-24 pl-4 py-6 border-green-700 focus:border-green-400 shadow-sm bg-white placeholder:text-green-300 h-12 rounded-full"
              disabled={isLoading || !geminiApiKey}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading || !input.trim() || !geminiApiKey}
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
