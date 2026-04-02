import { create } from 'zustand';
import {
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} from '../services/notificationApi';
import { notificationSocket } from '../services/notificationSocket';

/**
 * Tracks the store's own socket subscription so it can be cleaned up before
 * re-registering (prevents handler accumulation from multiple initForUser calls).
 */
let _storeNotifUnsubscribe = null;

/**
 * Zustand store for the notification system.
 *
 * Responsibilities:
 *  - REST: load/paginate, mark read, delete, badge count
 *  - WebSocket: connect on login, receive real-time pushes, disconnect on logout
 *  - Drawer open/close state
 */
export const useNotificationStore = create((set, get) => ({
    /* ── State ──────────────────────────────────────────────────────── */
    notifications:  [],
    unreadCount:    0,
    totalPages:     1,
    currentPage:    0,
    isLoading:      false,
    isLoadingMore:  false,
    isDrawerOpen:   false,
    error:          null,

    /* ── Initialise for logged-in user ──────────────────────────────── */
    /**
     * Call once after the user object is available (e.g. in Navbar on mount).
     * Loads initial data and connects the WebSocket.
     */
    initForUser: (userId, jwtToken = '') => {
        if (!userId) return;

        // Kick off initial data load
        get().loadNotifications(userId, 0);
        get().refreshUnreadCount(userId);

        // Connect WebSocket through the API Gateway
        notificationSocket.connect(userId, jwtToken);

        // Remove any previously registered store handler before adding a new one.
        // Without this, every call (including React StrictMode's double-invoke) adds
        // an extra handler, causing addIncoming to fire multiple times per message.
        if (_storeNotifUnsubscribe) {
            _storeNotifUnsubscribe();
        }
        _storeNotifUnsubscribe = notificationSocket.onNotification((incoming) => {
            get().addIncoming(incoming);
        });
    },

    /* ── REST actions ────────────────────────────────────────────────── */
    loadNotifications: async (userId, page = 0) => {
        if (!userId) return;
        const isAppend = page > 0;
        set(isAppend ? { isLoadingMore: true, error: null } : { isLoading: true, error: null });

        try {
            const data = await fetchNotifications(userId, page, 20);
            const items = data?.content ?? [];

            set({
                notifications: isAppend
                    ? [...get().notifications, ...items]
                    : items,
                totalPages:  data?.totalPages  ?? 1,
                currentPage: data?.number      ?? 0,
                isLoading:      false,
                isLoadingMore:  false,
            });
        } catch (err) {
            set({
                error: err?.message ?? 'Failed to load notifications.',
                isLoading:     false,
                isLoadingMore: false,
            });
        }
    },

    loadMore: (userId) => {
        const { currentPage, totalPages, isLoadingMore } = get();
        if (isLoadingMore || currentPage + 1 >= totalPages) return;
        get().loadNotifications(userId, currentPage + 1);
    },

    refreshUnreadCount: async (userId) => {
        if (!userId) return;
        try {
            const count = await fetchUnreadCount(userId);
            set({ unreadCount: count });
        } catch {
            // Badge count is non-critical — fail silently
        }
    },

    markRead: async (notificationId) => {
        try {
            await markAsRead(notificationId);
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.id === notificationId ? { ...n, read: true, status: 'READ' } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            }));
        } catch {
            // Let caller handle UI feedback
            throw new Error('Could not mark notification as read.');
        }
    },

    markAllRead: async (userId) => {
        try {
            await markAllAsRead(userId);
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, read: true, status: 'READ' })),
                unreadCount: 0,
            }));
        } catch {
            throw new Error('Could not mark all notifications as read.');
        }
    },

    remove: async (notificationId, userId) => {
        try {
            await deleteNotification(notificationId, userId);
            set((state) => {
                const removed = state.notifications.find((n) => n.id === notificationId);
                return {
                    notifications: state.notifications.filter((n) => n.id !== notificationId),
                    unreadCount: removed && !removed.read
                        ? Math.max(0, state.unreadCount - 1)
                        : state.unreadCount,
                };
            });
        } catch {
            throw new Error('Could not delete notification.');
        }
    },

    /* ── WebSocket ───────────────────────────────────────────────────── */
    /**
     * Called by the WebSocket handler when a notification arrives in real-time.
     * Prepends to the list and increments badge (deduplicates by ID).
     */
    addIncoming: (notification) => {
        set((state) => {
            const isDuplicate = state.notifications.some((n) => n.id === notification.id);
            return {
                notifications: isDuplicate
                    ? state.notifications
                    : [notification, ...state.notifications],
                unreadCount: isDuplicate ? state.unreadCount : state.unreadCount + 1,
            };
        });
    },

    disconnect: () => {
        if (_storeNotifUnsubscribe) {
            _storeNotifUnsubscribe();
            _storeNotifUnsubscribe = null;
        }
        notificationSocket.disconnect();
    },

    /* ── Drawer ──────────────────────────────────────────────────────── */
    openDrawer:  () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false }),
}));
