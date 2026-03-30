import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import ChatMessage from "../Components/ChatMessage";
import ChatInput from "../Components/ChatInput";
import SuggestedQuestions from "../Components/SuggestedQuestions";
import LanguageSelector from "../Components/LanguageSelector";
import { Link, useLocation } from "react-router-dom";
import {
  getWelcomeMessage,
  detectLanguage,
  LANGUAGES,
} from "../Services/LanguageService";
import {
  getChatResponse,
  getFallbackResponse,
  getRateLimitedFallbackResponse,
  resetChatConversationContext,
} from "../Services/ChatService";
import {
  clearConversationIdForActiveUser,
  persistConversationIdForActiveUser,
} from "../../../services/aiConversationPersistence";
import {
  fetchChatConversations,
  fetchConversationMessages,
} from "../../../api/aiHistoryApi";

const Index_Bot = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState("en");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversationSearch, setConversationSearch] = useState("");
  const messagesEndRef = useRef(null);
  const hasHydratedFromHistoryRef = useRef(false);

  const formatRelative = (dateTime) => {
    const ms = Date.now() - new Date(dateTime).getTime();
    const minutes = Math.floor(ms / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const loadConversations = async () => {
    try {
      setConversationsLoading(true);
      const data = await fetchChatConversations({ page: 0, size: 25 });
      const list = data?.history || data?.conversations || [];
      setConversations(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setConversationsLoading(false);
    }
  };

  const filteredConversations = conversations.filter((item) => {
    const q = conversationSearch.trim().toLowerCase();
    if (!q) return true;
    const title = String(item?.title || "").toLowerCase();
    const preview = String(item?.lastMessagePreview || "").toLowerCase();
    return title.includes(q) || preview.includes(q);
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    loadConversations();
  }, [])

  useEffect(() => {
    if (selectedConversationId) {
      const stillExists = conversations.some(
        (item) => item?.conversationId === selectedConversationId
      );
      if (!stillExists) {
        setSelectedConversationId(null);
      }
      return;
    }
    if (conversations.length > 0) {
      setSelectedConversationId(conversations[0]?.conversationId || null);
    }
  }, [conversations, selectedConversationId]);

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
    if (hasHydratedFromHistoryRef.current) return;
    const state = location.state;
    if (state?.startNewChat) {
      hasHydratedFromHistoryRef.current = true;
      resetChatConversationContext();
      clearConversationIdForActiveUser();
      setSelectedConversationId(null);
      setShowSuggestions(true);
      setMessages([
        {
          id: uuidv4(),
          type: "bot",
          text: getWelcomeMessage(language),
          language,
          timestamp: Date.now(),
        },
      ]);
      return;
    }

    const preview = state?.historyPreview;

    if (!state?.resumedFromHistory || !preview) return;

    hasHydratedFromHistoryRef.current = true;
    setShowSuggestions(false);
    if (preview.conversationId) {
      persistConversationIdForActiveUser(preview.conversationId);
      setSelectedConversationId(preview.conversationId);
    }
    const fallbackResumedMessages = [
      {
        id: uuidv4(),
        type: "bot",
        text: "Resumed from your selected history conversation.",
        language: preview.language || "en",
        timestamp: Date.now(),
      },
    ];
    if (preview.userMessage) {
      fallbackResumedMessages.push({
        id: uuidv4(),
        type: "user",
        text: preview.userMessage,
        language: preview.language || "en",
        timestamp: Date.now(),
      });
    }
    if (preview.assistantResponse) {
      fallbackResumedMessages.push({
        id: uuidv4(),
        type: "bot",
        text: preview.assistantResponse,
        language: preview.language || "en",
        timestamp: Date.now(),
      });
    }
    setMessages(fallbackResumedMessages);

    if (!preview.conversationId) return;

    let active = true;
    const hydrateFullConversation = async () => {
      try {
        const data = await fetchConversationMessages(preview.conversationId, {
          page: 0,
          size: 100,
        });
        if (!active) return;
        const rawMessages = data?.history || data?.messages || [];
        const mapped = rawMessages
          .map((message, index) => {
            const role = (message?.role || "").toLowerCase();
            const type = role === "assistant" ? "bot" : "user";
            const text = message?.content || "";
            if (!text) return null;
            return {
              id: message?.sequenceNo
                ? `${preview.conversationId}-${message.sequenceNo}`
                : `${preview.conversationId}-${index}`,
              type,
              text,
              language: preview.language || "en",
              timestamp: message?.createdAt
                ? new Date(message.createdAt).getTime()
                : Date.now(),
            };
          })
          .filter(Boolean);

        if (mapped.length > 0) {
          setMessages(mapped);
        }
      } catch (error) {
        console.error("Failed to load full conversation context:", error);
      }
    };

    hydrateFullConversation();
    return () => {
      active = false;
    };
  }, [location.state]);

  const openConversationInPlace = async (conversation) => {
    if (!conversation?.conversationId) return;
    setSelectedConversationId(conversation.conversationId);
    // Close sidebar on mobile only (handled by backdrop click, but also close on item select)
    if (window.innerWidth < 1024) setSidebarOpen(false);
    setShowSuggestions(false);
    persistConversationIdForActiveUser(conversation.conversationId);
    try {
      const data = await fetchConversationMessages(conversation.conversationId, {
        page: 0,
        size: 100,
      });
      const rawMessages = data?.history || data?.messages || [];
      const mapped = rawMessages
        .map((message, index) => {
          const role = (message?.role || "").toLowerCase();
          const type = role === "assistant" ? "bot" : "user";
          const text = message?.content || "";
          if (!text) return null;
          return {
            id: message?.sequenceNo
              ? `${conversation.conversationId}-${message.sequenceNo}`
              : `${conversation.conversationId}-${index}`,
            type,
            text,
            language: language || "en",
            timestamp: message?.createdAt
              ? new Date(message.createdAt).getTime()
              : Date.now(),
          };
        })
        .filter(Boolean);
      if (mapped.length > 0) setMessages(mapped);
    } catch (error) {
      console.error("Failed to open conversation:", error);
      toast.error("Failed to load this chat.");
    }
  };

  const handleNewChatFromSidebar = () => {
    clearConversationIdForActiveUser();
    resetChatConversationContext();
    setSelectedConversationId(null);
    setShowSuggestions(true);
    setMessages([
      {
        id: uuidv4(),
        type: "bot",
        text: getWelcomeMessage(language),
        language,
        timestamp: Date.now(),
      },
    ]);
  };

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
        console.error("Error in AI response:", response.error);
        throw response.error;
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
      if (response?.conversationId) {
        setSelectedConversationId(response.conversationId);
      }
      loadConversations();
    } catch (error) {
      console.error("Error getting response:", error);

      const fallbackResponse =
        error?.status === 429
          ? getRateLimitedFallbackResponse(userLanguage)
          : getFallbackResponse(userLanguage);

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
    resetChatConversationContext();
    setSelectedConversationId(null);
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

  // Full-viewport chat layout — fills the main content area provided by Layout
  return (
    <div className="flex h-[calc(100vh-3.5rem)] md:ml-14 bg-white">

      {/* ── Mobile sidebar backdrop ─────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className={[
          "flex flex-col shrink-0 bg-white border-r border-gray-100",
          "transition-all duration-200 ease-in-out overflow-hidden",
          // Mobile: slide-over overlay — starts below the fixed navbar (h-14 = 3.5rem)
          "fixed top-14 bottom-0 left-0 z-40 w-72",
          "lg:static lg:z-auto lg:top-auto lg:bottom-auto",
          sidebarOpen
            ? "translate-x-0 lg:w-72"
            : "-translate-x-full lg:translate-x-0 lg:w-0 lg:border-0",
        ].join(" ")}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base">🌱</span>
            <span className="text-sm font-semibold text-gray-800">Kisan Mitra</span>
          </div>
          <button
            onClick={handleNewChatFromSidebar}
            className="flex items-center gap-1 rounded-lg bg-green-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition-colors"
            title="Start a new chat"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
            </svg>
            New
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 shrink-0 border-b border-gray-50">
          <input
            value={conversationSearch}
            onChange={(e) => setConversationSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-green-200 focus:bg-white transition"
          />
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {conversationsLoading ? (
            <div className="flex items-center gap-2 px-3 py-4 text-xs text-gray-400">
              <div className="w-3 h-3 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
              Loading chats...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <div className="text-3xl mb-2">💬</div>
              <p className="text-xs text-gray-400">No chats yet.</p>
              <p className="text-xs text-gray-400 mt-0.5">Start a conversation.</p>
            </div>
          ) : (
            filteredConversations.map((conversation, index) => {
              const isActive = selectedConversationId === conversation?.conversationId;
              return (
                <button
                  key={conversation?.conversationId || index}
                  onClick={() => openConversationInPlace(conversation)}
                  className={[
                    "w-full rounded-lg px-3 py-2.5 text-left transition-all group",
                    isActive
                      ? "bg-green-50 border border-green-200"
                      : "hover:bg-gray-50 border border-transparent",
                  ].join(" ")}
                >
                  <div className="truncate text-sm font-medium text-gray-800 leading-snug">
                    {conversation?.title || "Untitled conversation"}
                  </div>
                  <div className="mt-0.5 line-clamp-1 text-xs text-gray-500 leading-relaxed">
                    {conversation?.lastMessagePreview || "No preview"}
                  </div>
                  <div className="mt-1 text-[11px] text-gray-400">
                    {formatRelative(conversation?.updatedAt || conversation?.createdAt || Date.now())}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-gray-100 px-3 py-2">
          <Link
            to="/history/kisan-mitra"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 hover:text-green-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Full chat history
          </Link>
        </div>
      </aside>

      {/* ── Chat panel ──────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0 bg-white">

        {/* Chat header */}
        <div className="shrink-0 flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
              title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 3v18"/>
              </svg>
            </button>

            {/* Bot identity */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-base shrink-0">
                🌱
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 leading-tight">Kisan Mitra</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-medium text-green-700 bg-green-50 border border-green-100 px-1.5 py-px rounded-full">AI</span>
                  <span className="text-[10px] text-gray-400">Farming assistant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetChat}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
              title="Start over"
            >
              <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <LanguageSelector
              selectedLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-3 py-4 bg-white"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="mx-auto max-w-2xl">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggested questions */}
        <SuggestedQuestions
          onQuestionClick={handleSuggestedQuestionClick}
          language={language}
          shouldShow={showSuggestions}
        />

        {/* Input — ChatInput provides its own padding + green gradient bg */}
        <ChatInput
          onSendMessage={handleSendMessage}
          language={language}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};

export default Index_Bot;
