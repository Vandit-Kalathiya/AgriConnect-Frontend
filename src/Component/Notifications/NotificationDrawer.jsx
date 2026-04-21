import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { formatDistanceToNow } from "date-fns";
import { FaTimes, FaBell, FaTrash, FaCheck } from "react-icons/fa";
import { MdDoneAll } from "react-icons/md";
import { useNotificationStore } from "../../stores/notificationStore";
import toast from "react-hot-toast";

/* ─── Event-type metadata ─────────────────────────────────────────────────── */

const EVENT_META = {
  USER_REGISTERED: { icon: "👤", label: "Welcome to AgriConnect!" },
  ORDER_PLACED: { icon: "🛒", label: "Your order has been placed" },
  LISTING_CREATED: { icon: "📋", label: "New listing published" },
  LISTING_UPDATED: { icon: "✏️", label: "Listing updated" },
  CONTRACT_SIGNED: { icon: "📝", label: "Contract signed successfully" },
  CONTRACT_CREATED: { icon: "📄", label: "New contract created" },
  AGREEMENT_SIGNED: { icon: "✅", label: "Agreement signed" },
  AGREEMENT_GENERATED: { icon: "📜", label: "Agreement document ready" },
  MARKET_TEST_EVENT: { icon: "🔔", label: "Test notification" },
  STORAGE_BOOKED: { icon: "🏪", label: "Storage booking confirmed" },
  PAYMENT_RECEIVED: { icon: "💰", label: "Payment received" },
};

const getEventMeta = (eventType) =>
  EVENT_META[eventType] ?? {
    icon: "🔔",
    label: eventType?.replace(/_/g, " ") ?? "Notification",
  };

/* ─── Skeleton ───────────────────────────────────────────────────────────── */

const SkeletonItem = () => (
  <div className="flex items-start gap-3 px-4 py-3 animate-pulse border-b border-gray-100">
    <div className="w-9 h-9 bg-gray-200 rounded-full shrink-0" />
    <div className="flex-1 space-y-2 pt-1">
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="h-2 bg-gray-100 rounded w-1/3" />
    </div>
  </div>
);

/* ─── Notification item ──────────────────────────────────────────────────── */

const NotificationItem = ({ notification, userId }) => {
  const { markRead, remove } = useNotificationStore();
  const { icon, label } = getEventMeta(notification.eventType);

  const isUnread = !notification.read && notification.status !== "READ";
  const isFailed = notification.status === "FAILED";

  const timeAgo = (() => {
    try {
      return formatDistanceToNow(new Date(notification.createdAt), {
        addSuffix: true,
      });
    } catch {
      return "";
    }
  })();

  const handleRead = async (e) => {
    e.stopPropagation();
    try {
      await markRead(notification.id);
    } catch {
      toast.error("Could not mark as read.");
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await remove(notification.id, userId);
    } catch {
      toast.error("Could not delete notification.");
    }
  };

  const handleClick = () => {
    if (isUnread) markRead(notification.id).catch(() => {});
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 transition-colors hover:bg-gray-50 group cursor-pointer ${
        isUnread ? "bg-blue-50/50" : "bg-white"
      }`}
    >
      {/* Icon + unread dot */}
      <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0 w-8">
        <span className="text-xl leading-none select-none">{icon}</span>
        {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${isUnread ? "font-semibold text-gray-800" : "text-gray-600"}`}
        >
          {label}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {notification.sourceService} · {notification.templateId}
        </p>
        {isFailed && (
          <p className="text-xs text-red-500 mt-0.5">Delivery failed</p>
        )}
        <p className="text-xs text-gray-400 mt-1">{timeAgo}</p>
      </div>

      {/* Actions — revealed on hover */}
      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {isUnread && (
          <button
            onClick={handleRead}
            className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-100 transition-colors"
            title="Mark as read"
          >
            <FaCheck size={10} />
          </button>
        )}
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <FaTrash size={10} />
        </button>
      </div>
    </div>
  );
};

/* ─── Main drawer ─────────────────────────────────────────────────────────── */

/**
 * NotificationDrawer
 *
 * Reads all state from Zustand — no props needed except userId (for API calls
 * that require it: markAllRead, loadMore, delete).
 *
 * Props:
 *  - userId {string | null}  Logged-in user's ID
 */
const NotificationDrawer = ({ userId }) => {
  const {
    isDrawerOpen,
    closeDrawer,
    notifications,
    isLoading,
    isLoadingMore,
    error,
    currentPage,
    totalPages,
    loadNotifications,
    loadMore,
    markAllRead,
    isEnabled,
    disabledReason,
  } = useNotificationStore();

  /* Load notifications when drawer opens */
  useEffect(() => {
    if (isDrawerOpen && userId) {
      loadNotifications(userId, 0);
    }
  }, [isDrawerOpen, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Close on Escape */
  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isDrawerOpen, closeDrawer]);

  const handleMarkAllRead = async () => {
    if (!userId) return;
    try {
      await markAllRead(userId);
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Could not mark all as read.");
    }
  };

  const hasUnread = notifications.some((n) => !n.read && n.status !== "READ");
  const hasMore = currentPage + 1 < totalPages;

  if (!isDrawerOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 z-[99]"
        aria-hidden="true"
        onClick={closeDrawer}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-label="Notifications"
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[100] flex flex-col"
        style={{ animation: "notifSlideIn 0.22s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <FaBell className="text-green-600" size={15} />
            <h2 className="font-semibold text-gray-800 text-[15px]">
              Notifications
            </h2>
          </div>
          <div className="flex items-center gap-1">
            {hasUnread && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium px-2 py-1 rounded hover:bg-green-50 transition-colors"
              >
                <MdDoneAll size={14} />
                Mark all read
              </button>
            )}
            <button
              onClick={closeDrawer}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded hover:bg-gray-100 transition-colors ml-1"
              aria-label="Close notifications"
            >
              <FaTimes size={13} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {!isEnabled ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-center px-8">
              <span className="text-5xl select-none">🔕</span>
              <p className="text-sm font-semibold text-gray-700">
                Notifications Disabled
              </p>
              <p className="text-xs text-gray-500 max-w-xs">
                {disabledReason ||
                  "Notifications are currently disabled in this environment."}
              </p>
            </div>
          ) : isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonItem key={i} />)
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-52 gap-3 text-center px-8">
              <span className="text-4xl select-none">⚠️</span>
              <p className="text-sm text-gray-500">{error}</p>
              <button
                onClick={() => loadNotifications(userId, 0)}
                className="text-sm text-green-600 hover:underline font-medium"
              >
                Try again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-center px-8">
              <span className="text-5xl select-none">🎉</span>
              <p className="text-sm font-semibold text-gray-700">
                You&apos;re all caught up!
              </p>
              <p className="text-xs text-gray-400">
                No in-app notifications yet.
              </p>
            </div>
          ) : (
            <>
              {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} userId={userId} />
              ))}

              {hasMore && (
                <div className="px-4 py-4 flex justify-center">
                  <button
                    onClick={() => loadMore(userId)}
                    disabled={isLoadingMore}
                    className="text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50 transition-colors"
                  >
                    {isLoadingMore ? "Loading…" : "Load more"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 shrink-0">
          <p className="text-[11px] text-gray-400 text-center">
            Showing in-app notifications · AgriConnect
          </p>
        </div>
      </div>

      <style>{`
                @keyframes notifSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
            `}</style>
    </>,
    document.body,
  );
};

export default NotificationDrawer;
