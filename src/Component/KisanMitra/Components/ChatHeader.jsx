import React from 'react';
import { RefreshCw } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const ChatHeader = ({
  language,
  onLanguageChange,
  onResetChat
}) => {
  return (
    React.createElement('div', { className: "flex items-center justify-between p-3 bg-green-100 border-b" },
      React.createElement('div', { className: "flex items-center" },
        React.createElement('div', { className: "w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3" },
          React.createElement('span', { className: "text-2xl" }, '🌱')
        ),
        React.createElement('div', null,
          React.createElement('h2', { className: "text-lg font-medium" }, "Kisan Mitra"),
          React.createElement('div', { className: "flex items-center gap-2 text-xs" },
            React.createElement('span', { className: "bg-green-100 text-green-600 px-2 py-0.5 rounded-sm" }, "AI Assistant"),
            React.createElement('span', { className: "bg-green-100 text-green-600 px-2 py-0.5 rounded-sm flex items-center gap-1" },
              React.createElement('svg', { 
                className: "w-3 h-3", 
                viewBox: "0 0 24 24", 
                fill: "none", 
                xmlns: "http://www.w3.org/2000/svg"
              },
                React.createElement('path', { 
                  d: "M12 18.75C15.3137 18.75 18 16.0637 18 12.75V11.25M12 18.75C8.68629 18.75 6 16.0637 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C10.3431 15.75 9 14.4069 9 12.75V4.5C9 2.84315 10.3431 1.5 12 1.5C13.6569 1.5 15 2.84315 15 4.5V12.75C15 14.4069 13.6569 15.75 12 15.75Z",
                  stroke: "currentColor",
                  strokeWidth: "1.5",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                })
              ),
              "Voice"
            )
          )
        )
      ),
      
      React.createElement('div', { className: "flex items-center gap-2" },
        React.createElement('button', {
          onClick: onResetChat,
          className: "w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-100 transition-colors",
          "aria-label": "Reset chat",
          title: "Reset chat"
        },
          React.createElement(RefreshCw, { size: 16, className: "text-green-600" })
        ),
        
        React.createElement(LanguageSelector, {
          selectedLanguage: language,
          onLanguageChange: onLanguageChange
        })
      )
    )
  );
};

export default ChatHeader;