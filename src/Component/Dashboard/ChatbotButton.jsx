import React from "react";
import { FaRobot } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const HIDDEN_PATHS = ["/support", "/crop-advisory", "/recommendations"];

const ChatbotButton = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Don't show when user is already on a chatbot page
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <button
      onClick={() => navigate("/support")}
      className="fixed bottom-4 right-6 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center z-50 group overflow-hidden"
      title="Ask Kisan Mitra"
    >
      <div className="flex items-center h-12 w-12 group-hover:w-40 transition-all duration-300">
        <FaRobot className="w-6 h-6 flex-shrink-0 ml-3" />
        <span className="ml-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Ask Kisan Mitra
        </span>
      </div>
    </button>
  );
};

export default ChatbotButton;
