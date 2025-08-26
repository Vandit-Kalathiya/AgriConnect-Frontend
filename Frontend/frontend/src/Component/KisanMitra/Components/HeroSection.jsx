import React from "react";
import { Sprout, Cloud, Tractor, Sun, Leaf } from "lucide-react";

const HeroSection = () => {
  return React.createElement(
    "div",
    { className: "w-full px-4 py-10 text-center" },
    <div className="inline-block px-5 py-2 bg-gradient-to-r from-jewel-200/30 to-jewel-400/30 backdrop-blur-sm rounded-full text-primary font-medium mb-6 shadow-md">
      <div className="flex items-center space-x-2">
        <Leaf className="h-5 w-5" />
        <span className="text-sm md:text-base">
          AI-Powered Kisan Assistant
        </span>
      </div>
    </div>,

    <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-5 bg-gradient-to-r from-jewel-400 via-jewel-500 to-jewel-600 bg-clip-text text-transparent drop-shadow-sm">
      Your Smart Farming Companion
    </h1>,

    React.createElement(
      "p",
      { className: "max-w-2xl mx-auto text-gray-600 mb-6" },
      "Get expert advice on farming techniques, crop management, weather adaptation, and market insights in multiple languages."
    ),

    React.createElement(
      "div",
      { className: "flex flex-wrap justify-center gap-8 max-w-3xl mx-auto" },
      React.createElement(FeatureItem, {
        icon: React.createElement(Sprout, { className: "text-green-500" }),
        title: "Crop Advice",
      }),
      React.createElement(FeatureItem, {
        icon: React.createElement(Cloud, { className: "text-green-500" }),
        title: "Weather Tips",
      }),
      React.createElement(FeatureItem, {
        icon: React.createElement(Tractor, { className: "text-green-500" }),
        title: "Equipment Help",
      }),
      React.createElement(FeatureItem, {
        icon: React.createElement(Sun, { className: "text-green-500" }),
        title: "Seasonal Guidance",
      })
    )
  );
};

const FeatureItem = ({ icon, title }) => {
  return React.createElement(
    "div",
    { className: "flex flex-col items-center gap-2" },
    React.createElement(
      "div",
      { className: "w-12 h-12 flex items-center justify-center" },
      icon
    ),
    React.createElement(
      "p",
      { className: "text-sm font-medium text-gray-700" },
      title
    )
  );
};

export default HeroSection;
