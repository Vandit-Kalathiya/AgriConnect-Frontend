import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Info } from 'lucide-react';
import voiceService from '../Services/VoiceService';
import { detectLanguage } from '../Services/LanguageService';

const ChatInput = ({ onSendMessage, language, isProcessing }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState(undefined);
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (inputRef.current && !isListening) {
      inputRef.current.focus();
    }
  }, [isListening]);
  
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message, detectedLanguage);
      setMessage('');
      setDetectedLanguage(undefined);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const toggleListening = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      
      if (transcript.trim()) {
        detectLanguage(transcript)
          .then(detectedLang => {
            setDetectedLanguage(detectedLang);
            setMessage(transcript);
            setTimeout(() => {
              onSendMessage(transcript, detectedLang);
              setTranscript('');
              setMessage('');
              setDetectedLanguage(undefined);
            }, 500);
          })
          .catch(err => {
            console.error("Error detecting language:", err);
            setMessage(transcript);
            setTimeout(() => {
              onSendMessage(transcript);
              setTranscript('');
              setMessage('');
            }, 500);
          });
      }
    } else {
      const started = voiceService.startListening(
        language,
        (newTranscript, isFinal) => {
          setTranscript(newTranscript);
          if (isFinal) {
            setMessage(newTranscript);
          }
        },
        () => {
          setIsListening(false);
        }
      );
      
      if (started) {
        setIsListening(true);
        setTranscript('');
      }
    }
  };
  
  return (
    React.createElement('div', { className: "p-4 border-t border-green-200 bg-gradient-to-r from-green-200 to-green-100" },
      React.createElement('div', { className: "relative flex items-center w-full" },
        React.createElement('input', {
          ref: inputRef,
          type: "text",
          placeholder: "Type or speak your farming question here...",
          className: "flex-1 border border-green-300 rounded-full py-3 pl-5 pr-28 focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-white shadow-md",
          value: isListening ? transcript || 'Listening...' : message,
          onChange: (e) => setMessage(e.target.value),
          onKeyDown: handleKeyDown,
          disabled: isListening || isProcessing
        }),
        
        React.createElement('div', { className: "absolute right-2 flex items-center gap-2" },
          React.createElement('button', {
            onClick: toggleListening,
            disabled: isProcessing,
            className: `w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isListening
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-green-200 text-green-700 hover:bg-green-300 shadow-md'
            }`,
            "aria-label": isListening ? 'Stop listening' : 'Start voice input',
            title: isListening ? 'Stop listening' : 'Start voice input'
          },
            isListening 
              ? React.createElement(MicOff, { size: 18 })
              : React.createElement(Mic, { size: 18 })
          ),
          
          React.createElement('button', {
            onClick: handleSendMessage,
            disabled: !message.trim() || isProcessing || isListening,
            className: `w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
              message.trim() && !isProcessing && !isListening
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`,
            "aria-label": "Send message",
            title: "Send message"
          },
            React.createElement(Send, { size: 18 })
          )
        ),
        
        isListening && (
          React.createElement('div', { className: "absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-3 py-2 flex items-center space-x-2 border border-green-200 z-10" },
            React.createElement('span', { className: "text-sm text-gray-700" }, "Listening..."),
            React.createElement('div', { className: "listening-animation" },
              [1, 2, 3, 4].map((i) => (
                React.createElement('div', {
                  key: i,
                  className: "listening-bar h-3 bg-gradient-to-t from-green-500 to-green-600",
                  style: {
                    animationName: 'wave',
                    animationDuration: '1.5s',
                    animationIterationCount: 'infinite',
                    animationDelay: `${i * 0.2}s`,
                  }
                })
              ))
            )
          )
        )
      ),
      
      React.createElement('div', { className: "text-xs text-center mt-2 text-gray-600 flex items-center justify-center" },
        React.createElement(Info, { size: 12, className: "mr-1" }),
        React.createElement('span', null, "Press Enter to send • Your language will be automatically detected")
      )
    )
  );
};

export default ChatInput;