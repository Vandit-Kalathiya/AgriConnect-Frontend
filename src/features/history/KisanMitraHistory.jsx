import usePaginatedHistory from "../../hooks/usePaginatedHistory";
import {
  deleteAllAiHistory,
  deleteConversationById,
  deleteKisanMitraHistory,
  fetchChatConversations,
  fetchConversationMessages,
  renameConversationTitle,
} from "../../api/aiHistoryApi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  clearConversationIdForActiveUser,
  persistConversationIdForActiveUser,
} from "../../services/aiConversationPersistence";
import { toast } from "sonner";

const formatDate = (dateTime) => new Date(dateTime).toLocaleString();

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

const KisanMitraHistory = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameTitle, setRenameTitle] = useState("");
  const [renameConversationId, setRenameConversationId] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteIntent, setDeleteIntent] = useState({
    type: "",
    conversationId: "",
    title: "",
  });
  const [deleting, setDeleting] = useState(false);
  const pageParam = Number(searchParams.get("page") || 0);
  const sizeParam = Number(searchParams.get("size") || 20);
  const updateQueryParams = useCallback(
    ({ page, size }) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(page));
        next.set("size", String(size));
        return next;
      });
    },
    [setSearchParams]
  );

  const continueChat = useCallback(
    (conversation, userMessage = "", assistantResponse = "") => {
      if (conversation?.conversationId) {
        persistConversationIdForActiveUser(conversation.conversationId);
      }

      navigate("/support", {
        state: {
          resumedFromHistory: true,
          historyPreview: {
            userMessage,
            assistantResponse,
            language: conversation?.language || "en",
            conversationId: conversation?.conversationId || null,
          },
        },
      });
    },
    [navigate]
  );

  const startNewChat = useCallback(() => {
    clearConversationIdForActiveUser();
    navigate("/support", {
      state: {
        startNewChat: true,
      },
    });
  }, [navigate]);

  const {
    items: conversations,
    hasMore,
    loading,
    initialLoading,
    error,
    loadMore,
    refresh,
    replaceItems,
  } = usePaginatedHistory(fetchChatConversations, {
    initialPage: Number.isFinite(pageParam) ? pageParam : 0,
    initialSize: Number.isFinite(sizeParam) ? sizeParam : 20,
    onPageLoaded: updateQueryParams,
  });

  const openDeleteModal = useCallback((intent) => {
    setDeleteIntent({
      type: intent?.type || "",
      conversationId: intent?.conversationId || "",
      title: intent?.title || "",
    });
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    if (deleting) return;
    setDeleteModalOpen(false);
    setDeleteIntent({ type: "", conversationId: "", title: "" });
  }, [deleting]);

  const executeDelete = useCallback(async () => {
    try {
      setDeleting(true);

      if (deleteIntent.type === "single" && deleteIntent.conversationId) {
        await deleteConversationById(deleteIntent.conversationId);
        replaceItems(
          conversations.filter(
            (item) => item?.conversationId !== deleteIntent.conversationId
          )
        );
        toast.success("Chat deleted.");
        await refresh(pageParam, sizeParam);
        if (selectedConversationId === deleteIntent.conversationId) {
          setSelectedConversationId(null);
          setConversationMessages([]);
        }
      } else if (deleteIntent.type === "all-chats") {
        await deleteKisanMitraHistory();
        replaceItems([]);
        toast.success("All Kisan Mitra chats deleted.");
        await refresh(0, sizeParam);
        setSelectedConversationId(null);
        setConversationMessages([]);
      } else if (deleteIntent.type === "all-ai") {
        await deleteAllAiHistory();
        replaceItems([]);
        toast.success("All AI history deleted.");
        await refresh(0, sizeParam);
        setSelectedConversationId(null);
        setConversationMessages([]);
      }

      setDeleteModalOpen(false);
      setDeleteIntent({ type: "", conversationId: "", title: "" });
    } catch (error) {
      console.error("Delete operation failed:", error);
      toast.error("Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
    }
  }, [
    conversations,
    deleteIntent,
    pageParam,
    refresh,
    replaceItems,
    selectedConversationId,
    sizeParam,
  ]);

  const filteredConversations = useMemo(() => {
    const text = searchText.trim().toLowerCase();
    return conversations.filter((item) => {
      const title = item?.title || "";
      const preview = item?.lastMessagePreview || "";
      return (
        !text ||
        title.toLowerCase().includes(text) ||
        preview.toLowerCase().includes(text)
      );
    });
  }, [conversations, searchText]);

  const selectedConversation = useMemo(
    () =>
      filteredConversations.find(
        (conversation) => conversation.conversationId === selectedConversationId
      ) || null,
    [filteredConversations, selectedConversationId]
  );

  useEffect(() => {
    if (selectedConversationId || filteredConversations.length === 0) return;
    setSelectedConversationId(filteredConversations[0].conversationId);
  }, [filteredConversations, selectedConversationId]);

  useEffect(() => {
    if (!selectedConversationId) return;

    let active = true;
    const loadMessages = async () => {
      setMessagesLoading(true);
      setMessagesError("");
      try {
        const data = await fetchConversationMessages(selectedConversationId, {
          page: 0,
          size: 50,
        });
        if (!active) return;
        setConversationMessages(data?.history || data?.messages || []);
      } catch (error) {
        if (!active) return;
        console.error("Failed to load conversation messages:", error);
        if (error?.status === 404 || error?.response?.status === 404) {
          toast.error("This chat was archived/cleaned up.");
          setSelectedConversationId(null);
          setConversationMessages([]);
          refresh(0, sizeParam);
          return;
        }
        setMessagesError("Failed to load messages for selected chat.");
      } finally {
        if (active) setMessagesLoading(false);
      }
    };

    loadMessages();
    return () => {
      active = false;
    };
  }, [refresh, selectedConversationId, sizeParam]);

  const getPreviewPair = useCallback(() => {
    let userMessage = "";
    let assistantResponse = "";

    for (let i = conversationMessages.length - 1; i >= 0; i -= 1) {
      const message = conversationMessages[i];
      const role = (message?.role || "").toLowerCase();
      const content = message?.content || "";
      if (!assistantResponse && role === "assistant") assistantResponse = content;
      if (!userMessage && role === "user") userMessage = content;
      if (userMessage && assistantResponse) break;
    }

    return { userMessage, assistantResponse };
  }, [conversationMessages]);

  const openRenameModal = useCallback((conversation) => {
    setRenameConversationId(conversation?.conversationId || "");
    setRenameTitle(conversation?.title || "");
    setRenameModalOpen(true);
  }, []);

  const closeRenameModal = useCallback(() => {
    if (renaming) return;
    setRenameModalOpen(false);
    setRenameConversationId("");
    setRenameTitle("");
  }, [renaming]);

  const handleRenameSubmit = useCallback(async () => {
    const title = renameTitle.trim();
    if (!renameConversationId) return;
    if (!title) {
      toast.error("Title cannot be empty.");
      return;
    }
    if (title.length > 140) {
      toast.error("Title must be at most 140 characters.");
      return;
    }

    try {
      setRenaming(true);
      await renameConversationTitle(renameConversationId, title);
      toast.success("Chat title updated.");
      await refresh(pageParam, sizeParam);
      setRenameModalOpen(false);
      setRenameConversationId("");
      setRenameTitle("");
    } catch (error) {
      console.error("Failed to rename chat:", error);
      toast.error(
        error?.response?.data?.message || "Failed to rename this chat."
      );
    } finally {
      setRenaming(false);
    }
  }, [pageParam, refresh, renameConversationId, renameTitle, sizeParam]);

  if (initialLoading) {
    return <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">Loading chat history...</div>;
  }

  if (error) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold md:text-xl">Kisan Mitra History</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={startNewChat}
            className="rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100"
          >
            New chat
          </button>
          <button
            onClick={() => refresh(0, sizeParam)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Refresh
          </button>
          <button
            onClick={() =>
              openDeleteModal({
                type: "all-chats",
                title: "Delete all Kisan Mitra chat history?",
              })
            }
            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
          >
            Delete all chats
          </button>
          <button
            onClick={() =>
              openDeleteModal({
                type: "all-ai",
                title: "Delete all AI history (Kisan Mitra + Crop Advisory)?",
              })
            }
            className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-800 hover:bg-red-100"
          >
            Delete all AI history
          </button>
        </div>
      </div>

      <div className="mb-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search conversation title or preview..."
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-200"
        />
      </div>

      {!filteredConversations.length ? (
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
          No chat history yet. Ask your first farming question.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Chats
            </div>
            <div className="max-h-[65vh] overflow-y-auto p-2">
              {filteredConversations.map((conversation, index) => {
                const isActive =
                  selectedConversationId === conversation.conversationId;
                return (
                  <div
                    key={`${conversation.conversationId || index}`}
                    onClick={() =>
                      setSelectedConversationId(conversation.conversationId)
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedConversationId(conversation.conversationId)}
                    className={`mb-2 w-full rounded-lg border px-3 py-2 text-left transition cursor-pointer ${
                      isActive
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="mb-1 truncate text-sm font-medium text-gray-900">
                      {conversation.title || "Untitled conversation"}
                    </div>
                    <div className="line-clamp-2 text-xs text-gray-600">
                      {conversation.lastMessagePreview || "No preview available"}
                    </div>
                    <div className="mt-1 text-[11px] text-gray-500">
                      {formatRelative(conversation.updatedAt || conversation.createdAt)}
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openRenameModal(conversation);
                        }}
                        className="rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-50"
                      >
                        Rename
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            {!selectedConversation ? (
              <div className="text-sm text-gray-600">
                Select a chat from the sidebar to view and continue it.
              </div>
            ) : (
              <>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {selectedConversation.title || "Untitled conversation"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Updated {formatDate(selectedConversation.updatedAt || selectedConversation.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        const { userMessage, assistantResponse } = getPreviewPair();
                        continueChat(
                          selectedConversation,
                          userMessage,
                          assistantResponse
                        );
                      }}
                      className="rounded-lg border border-green-200 bg-white px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50"
                    >
                      Continue this chat
                    </button>
                    <button
                      onClick={() => openRenameModal(selectedConversation)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() =>
                        openDeleteModal({
                          type: "single",
                          conversationId: selectedConversation.conversationId,
                          title: "Delete this chat conversation?",
                        })
                      }
                      className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                    >
                      Delete this chat
                    </button>
                  </div>
                </div>

                {messagesLoading ? (
                  <div className="text-sm text-gray-600">Loading messages...</div>
                ) : messagesError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {messagesError}
                  </div>
                ) : (
                  <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
                    {conversationMessages.length === 0 ? (
                      <div className="text-sm text-gray-600">No messages found for this conversation.</div>
                    ) : (
                      conversationMessages.map((message, messageIndex) => {
                        const isUser =
                          (message?.role || "").toLowerCase() === "user";
                        return (
                          <div
                            key={`${message.sequenceNo || messageIndex}`}
                            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                              isUser
                                ? "ml-auto bg-green-600 text-white"
                                : "mr-auto border border-gray-200 bg-gray-50 text-gray-800"
                            }`}
                          >
                            {message?.content || ""}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      )}

      {hasMore && (
        <button
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
          onClick={loadMore}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More Chats"}
        </button>
      )}

      {renameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
            <h3 className="text-base font-semibold text-gray-900">Rename chat</h3>
            <p className="mt-1 text-xs text-gray-500">
              Enter a new title (max 140 characters).
            </p>
            <input
              autoFocus
              value={renameTitle}
              onChange={(event) => setRenameTitle(event.target.value)}
              maxLength={140}
              placeholder="Type conversation title"
              className="mt-3 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-200"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeRenameModal}
                disabled={renaming}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameSubmit}
                disabled={renaming}
                className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
              >
                {renaming ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
            <h3 className="text-base font-semibold text-gray-900">
              Confirm delete
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {deleteIntent.title || "Are you sure you want to delete this item?"}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KisanMitraHistory;
