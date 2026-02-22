import React, { useState } from 'react';
import { Volume2, Clock } from 'lucide-react';
import voiceService from '../Services/VoiceService';
import { cn } from '../Lib/Utils';
import ReactMarkdown from 'react-markdown';
import { LANGUAGES } from '../Services/LanguageService';
import { format } from 'date-fns';

const ChatMessage = ({ message }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const handleTextToSpeech = () => {
    if (isSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    
    setIsSpeaking(true);
    voiceService.speak(
      message.text, 
      message.language, 
      () => setIsSpeaking(false)
    );
  };
  
  const enhanceText = (text) => {
    if (message.type === 'bot') {
      const terms = [
        'crops', 'farming', 'harvest', 'soil', 'seeds', 'irrigation', 'fertilizer',
        'pesticide', 'organic', 'sustainable', 'yield', 'season', 'plant', 'grow',
        'agriculture', 'climate', 'weather', 'cultivation', 'rotation', 'government',
        'scheme', 'subsidy', 'market', 'price', 'water', 'rainfall', 'disease',
        'treatment', 'livestock', 'loan', 'technique', 'method', 'manure', 'compost',
        'tools', 'equipment', 'storage', 'sell', 'buy', 'profit', 'loss', 'bank',
        'credit', 'loan', 'interest', 'money', 'income'
      ];
      
      let enhancedText = text;
      terms.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b(?![^<]*>|[^<>]*<\\/)`, 'gi');
        enhancedText = enhancedText.replace(regex, `**${term}**`);
      });
      
      return enhancedText;
    }
    return text;
  };

  const getLanguageLabel = () => {
    const languageOption = LANGUAGES.find(lang => lang.value === message.language);
    return languageOption ? `${languageOption.label} (${languageOption.nativeLabel})` : 'English';
  };

  const formatTime = (timestamp) => {
    return format(new Date(timestamp), 'h:mm a');
  };
  
  return (
    React.createElement('div', { 
      className: cn(
        "flex gap-3 mb-4",
        message.type === 'user' ? "justify-end" : "justify-start"
      )
    },
      message.type === 'bot' && (
        React.createElement('div', { className: "w-9 h-9 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-1" },
          React.createElement('span', { className: "text-lg" }, '🌱')
        )
      ),
      
      React.createElement('div', { 
        className: cn(
          "px-4 py-3 rounded-2xl max-w-[85%] relative shadow-sm",
          message.type === 'user' 
            ? "bg-gradient-to-r from-green-600 to-green-700 text-white" 
            : "bg-gradient-to-r from-green-100 to-green-200 text-gray-800"
        )
      },
        React.createElement('div', { className: "relative" },
          message.isProcessing ? (
            React.createElement('div', { className: "flex flex-col" },
              React.createElement('div', { className: "flex items-center space-x-2 text-green-600 mb-1" },
                React.createElement('div', { className: "w-5 h-5 relative" },
                  React.createElement('div', { className: "absolute inset-0 rounded-full border-2 border-green-200 border-t-green-500 animate-spin" })
                ),
                React.createElement('span', { className: "font-medium" }, "Thinking...")
              ),
              React.createElement('p', { className: "text-gray-600 text-sm" }, "Finding the best farming advice for you in simple words")
            )
          ) : (
            React.createElement('div', { className: "chat-content" },
              message.type === 'bot' ? (
                React.createElement('div', { className: "bot-message-content prose-sm prose-green" },
                  React.createElement(ReactMarkdown, null, enhanceText(message.text))
                )
              ) : (
                React.createElement('p', null, message.text)
              ),
              
              message.type === 'bot' && (
                React.createElement('div', { className: "flex items-center justify-between mt-2 pt-2 border-t border-green-300/50" },
                  React.createElement('div', { className: "flex items-center gap-2" },
                    React.createElement('span', { className: "inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700" }, 
                      getLanguageLabel()
                    ),
                    React.createElement('span', { className: "flex items-center text-xs text-green-700/80 gap-1" },
                      React.createElement(Clock, { size: 12 }),
                      formatTime(message.timestamp)
                    )
                  ),
                  React.createElement('button', {
                    onClick: handleTextToSpeech,
                    className: cn(
                      "flex items-center justify-center text-xs gap-1 transition-colors",
                      isSpeaking 
                        ? "text-green-600" 
                        : "text-gray-500 hover:text-green-600"
                    ),
                    "aria-label": isSpeaking ? "Stop speaking" : "Listen to this response",
                    title: isSpeaking ? "Stop speaking" : "Listen to this response"
                  },
                    React.createElement(Volume2, { size: 14 }),
                    React.createElement('span', null, isSpeaking ? "Stop listening" : "Listen")
                  )
                )
              )
            )
          )
        )
      ),
      
      message.type === 'user' && (
        React.createElement('div', { className: "flex flex-col items-end" },
          React.createElement('div', { className: "w-9 h-9 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center mb-1" },
            React.createElement('span', { className: "text-lg" }, '👨‍🌾')
          ),
          React.createElement('span', { className: "text-xs text-green-700 flex items-center gap-1 mr-1" },
            React.createElement(Clock, { size: 10 }),
            formatTime(message.timestamp)
          )
        )
      )
    )
  );
};

export default ChatMessage;