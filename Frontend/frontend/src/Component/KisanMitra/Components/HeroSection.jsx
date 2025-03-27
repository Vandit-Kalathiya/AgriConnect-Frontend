import React from 'react';
import { Sprout, Cloud, Tractor, Sun } from 'lucide-react';

const HeroSection = () => {
  return (
    React.createElement('div', { className: "w-full px-4 py-10 text-center" },
      React.createElement('div', { className: "inline-block px-4 py-1 mb-3 text-sm font-medium text-green-600 bg-green-100 rounded-full" },
        "AI-Powered Agricultural Assistant"
      ),
      
      React.createElement('h1', { className: "text-3xl md:text-4xl font-semibold text-gray-800 mb-4" },
        "Your Smart Farming Companion"
      ),
      
      React.createElement('p', { className: "max-w-2xl mx-auto text-gray-600 mb-12" },
        "Get expert advice on farming techniques, crop management, weather adaptation, and market insights in multiple languages."
      ),
      
      React.createElement('div', { className: "flex flex-wrap justify-center gap-8 max-w-3xl mx-auto" },
        React.createElement(FeatureItem, { 
          icon: React.createElement(Sprout, { className: "text-green-500" }),
          title: "Crop Advice" 
        }),
        React.createElement(FeatureItem, { 
          icon: React.createElement(Cloud, { className: "text-green-500" }),
          title: "Weather Tips" 
        }),
        React.createElement(FeatureItem, { 
          icon: React.createElement(Tractor, { className: "text-green-500" }),
          title: "Equipment Help" 
        }),
        React.createElement(FeatureItem, { 
          icon: React.createElement(Sun, { className: "text-green-500" }),
          title: "Seasonal Guidance" 
        })
      )
    )
  );
};

const FeatureItem = ({ icon, title }) => {
  return (
    React.createElement('div', { className: "flex flex-col items-center gap-2" },
      React.createElement('div', { className: "w-12 h-12 flex items-center justify-center" },
        icon
      ),
      React.createElement('p', { className: "text-sm font-medium text-gray-700" }, title)
    )
  );
};

export default HeroSection;