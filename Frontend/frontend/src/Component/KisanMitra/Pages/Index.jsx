import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import ChatHeader from "../Components/ChatHeader";
import ChatMessage from "../Components/ChatMessage";
import ChatInput from "../Components/ChatInput";
import SuggestedQuestions from "../Components/SuggestedQuestions";
import HeroSection from "../Components/HeroSection";
import Footer from "../Components/Footer";
import {
  getWelcomeMessage,
  detectLanguage,
  LANGUAGES,
} from "../Services/LanguageService";
import { getChatResponse, getFallbackResponse } from "../Services/ChatService";

const Index_Bot = () => {
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState("en");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  useEffect(() => {
    const welcomeMessage = {
      id: uuidv4(),
      type: "bot",
      text: getWelcomeMessage(language),
      language,
      timestamp: Date.now(),
    };

    setMessages([welcomeMessage]);
    setShowSuggestions(true);
  }, [language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (text, detectedInputLanguage) => {
    if (!text.trim() || isProcessing) return;

    setShowSuggestions(false);

    let userLanguage = language;
    let forcedLanguage = null;

    const lowercaseText = text.toLowerCase();

    for (const lang of LANGUAGES) {
      const switchPatterns = [
        new RegExp(`speak\\s+${lang.label}`, "i"),
        new RegExp(`in\\s+${lang.label}`, "i"),
        new RegExp(`use\\s+${lang.label}`, "i"),
        new RegExp(`switch\\s+to\\s+${lang.label}`, "i"),
        new RegExp(lang.nativeLabel, "i"),
      ];

      if (switchPatterns.some((pattern) => pattern.test(lowercaseText))) {
        forcedLanguage = lang.value;
        break;
      }
    }

    if (forcedLanguage) {
      userLanguage = forcedLanguage;
      if (userLanguage !== language) {
        setLanguage(userLanguage);
        const langOption = LANGUAGES.find((l) => l.value === userLanguage);
        const langLabel = langOption ? langOption.label : userLanguage;

        toast.info(`Switching to ${langLabel} as requested.`);
      }
    } else if (!detectedInputLanguage) {
      try {
        const detectedLang = await detectLanguage(text);

        if (detectedLang !== language) {
          const langOption = LANGUAGES.find((l) => l.value === detectedLang);
          const langLabel = langOption ? langOption.label : detectedLang;

          if (
            text.length < 20 ||
            detectedLang === "hi" ||
            detectedLang === "pa"
          ) {
            userLanguage = detectedLang;
            setLanguage(detectedLang);
            toast.info(`Detected ${langLabel}. Switching language.`);
          } else {
            console.log(
              `Detected ${langLabel} but keeping current language preference.`
            );
          }
        }
      } catch (error) {
        console.error("Error detecting language:", error);
      }
    } else {
      userLanguage = detectedInputLanguage;
      if (userLanguage !== language) {
        setLanguage(userLanguage);
      }
    }

    const userMessage = {
      id: uuidv4(),
      type: "user",
      text,
      language: userLanguage,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const processingMessageId = uuidv4();
    const processingMessage = {
      id: processingMessageId,
      type: "bot",
      text: "",
      language: userLanguage,
      timestamp: Date.now(),
      isProcessing: true,
    };

    setMessages((prev) => [...prev, processingMessage]);
    setIsProcessing(true);

    try {
      const response = await Promise.race([
        getChatResponse([...messages, userMessage], userLanguage),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Response took too long")), 30000)
        ),
      ]);

      if (response.error) {
        console.error("Error in Gemini response:", response.error);
        throw new Error(response.error);
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === processingMessageId
            ? {
                ...msg,
                text: response.text,
                isProcessing: false,
              }
            : msg
        )
      );
    } catch (error) {
      console.error("Error getting response:", error);

      const fallbackResponse = getFallbackResponse(userLanguage);

      toast.error("Could not get a response. Please try again.");

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === processingMessageId
            ? {
                ...msg,
                text: fallbackResponse,
                isProcessing: false,
              }
            : msg
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    if (newLanguage !== language) {
      setLanguage(newLanguage);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: uuidv4(),
        type: "bot",
        text: getWelcomeMessage(language),
        language,
        timestamp: Date.now(),
      },
    ]);
    setShowSuggestions(true);
  };

  const handleSuggestedQuestionClick = (question) => {
    handleSendMessage(question);
  };

  return React.createElement(
    "div",
    {
      className:
        "min-h-screen flex flex-col items-center bg-gradient-to-br from-green-50 via-green-100/30 to-emerald-50 relative mt-20",
    },
    React.createElement("div", {
      className: "absolute inset-0 z-0 bg-leaf-pattern opacity-30",
    }),

    React.createElement(
      "div",
      { className: "relative z-10 w-full max-w-5xl" },
      React.createElement(HeroSection, null),

      React.createElement(
        "div",
        { className: "w-full px-4 py-8 mx-auto" },
        React.createElement(
          "div",
          {
            className:
              "glass-effect rounded-xl shadow-xl overflow-hidden w-full border border-green-200/50",
          },
          React.createElement(ChatHeader, {
            language: language,
            onLanguageChange: handleLanguageChange,
            onResetChat: handleResetChat,
          }),

          React.createElement(
            "div",
            {
              className:
                "p-4 overflow-y-auto bg-white/60 backdrop-blur-sm h-[60vh] min-h-[450px]",
              style: { scrollBehavior: "smooth" },
            },
            messages.map((message) =>
              React.createElement(ChatMessage, {
                key: message.id,
                message: message,
              })
            ),
            React.createElement("div", { ref: messagesEndRef })
          ),

          React.createElement(SuggestedQuestions, {
            onQuestionClick: handleSuggestedQuestionClick,
            language: language,
            shouldShow: showSuggestions,
          }),

          React.createElement(ChatInput, {
            onSendMessage: handleSendMessage,
            language: language,
            isProcessing: isProcessing,
          })
        )
      ),

      React.createElement(Footer, null)
    )
  );
};

export default Index_Bot;
