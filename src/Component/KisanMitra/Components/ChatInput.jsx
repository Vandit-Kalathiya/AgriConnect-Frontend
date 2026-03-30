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
          .then((detectedLang) => {
            setDetectedLanguage(detectedLang);
            setMessage(transcript);
            setTimeout(() => {
              onSendMessage(transcript, detectedLang);
              setTranscript('');
              setMessage('');
              setDetectedLanguage(undefined);
            }, 500);
          })
          .catch((err) => {
            console.error('Error detecting language:', err);
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
    <div className="px-3 sm:px-4 py-2 border-t border-green-200 bg-gradient-to-r from-green-200 to-green-100">
      {/* Input row — full width on mobile, centered/capped on larger screens */}
      <div className="relative flex items-center w-full sm:max-w-xl sm:mx-auto">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type or speak your question..."
          className="flex-1 min-w-0 border border-green-300 rounded-full py-2 pl-4 pr-[4.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-white shadow-sm"
          value={isListening ? transcript || 'Listening...' : message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isListening || isProcessing}
        />

        <div className="absolute right-1.5 flex items-center gap-1">
          <button
            onClick={toggleListening}
            disabled={isProcessing}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${
              isListening
                ? 'bg-red-500 text-white shadow-sm'
                : 'bg-green-200 text-green-700 hover:bg-green-300 shadow-sm'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <MicOff size={14} /> : <Mic size={14} />}
          </button>

          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isProcessing || isListening}
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              message.trim() && !isProcessing && !isListening
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-sm'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Send message"
            title="Send message"
          >
            <Send size={14} />
          </button>
        </div>

        {isListening && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg px-3 py-2 flex items-center gap-2 border border-green-200 z-10 whitespace-nowrap">
            <span className="text-xs text-gray-700">Listening...</span>
            <div className="flex items-end gap-0.5 h-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-0.5 bg-gradient-to-t from-green-500 to-green-600 rounded-full animate-bounce"
                  style={{ height: '60%', animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hint text */}
      <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-gray-500">
        <Info size={9} />
        <span>Press Enter to send • Language auto-detected</span>
      </div>
    </div>
  );
};

export default ChatInput;
