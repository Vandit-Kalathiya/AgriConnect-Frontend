import React, { useState, useEffect } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Key, Check, Eye, EyeOff } from "lucide-react";
import { useToast } from "../Hooks/use-toast";

const GeminiApiKeyInput = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState("");
  const [keyStored, setKeyStored] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedKey = localStorage.getItem("geminiApiKey");
    if (storedKey) {
      setApiKey(storedKey);
      setKeyStored(true);
      onApiKeySet(storedKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("geminiApiKey", apiKey);
      setKeyStored(true);
      onApiKeySet(apiKey);
      toast({
        title: "API Key Saved",
        description:
          "Your Gemini API key has been stored securely in local storage.",
      });
    } else {
      toast({
        title: "Empty API Key",
        description: "Please enter a valid Gemini API key.",
        variant: "destructive",
      });
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem("geminiApiKey");
    setApiKey("");
    setKeyStored(false);
    toast({
      title: "API Key Removed",
      description: "Your Gemini API key has been removed from local storage.",
    });
  };

  return (
    <div className="w-full space-y-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Key className="h-4 w-4 text-primary" />
        <h3>Gemini API Configuration</h3>
      </div>

      <div className="text-sm text-muted-foreground">
        {keyStored ? (
          <p className="flex items-center gap-1 text-emerald-600">
            <Check className="h-3 w-3" />
            API key is set and ready to use
          </p>
        ) : (
          <p>
            Enter your Gemini API key to get personalized crop recommendations
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type={isRevealed ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="w-full pr-10"
          />
          {keyStored && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              onClick={() => setIsRevealed(!isRevealed)}
            >
              {isRevealed ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {keyStored ? (
          <Button variant="outline" size="sm" onClick={handleClearApiKey}>
            Clear
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleSaveApiKey}
            disabled={!apiKey.trim()}
          >
            Save
          </Button>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        Your API key is stored locally in your browser and is not sent to our
        servers.
        <a
          href="https://ai.google.dev/tutorials/setup"
          className="text-primary hover:underline ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get a Gemini API key
        </a>
      </div>
    </div>
  );
};

export default GeminiApiKeyInput;
