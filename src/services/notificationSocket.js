import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { isNotificationEnabled } from '../config/featureFlags';

// Use a same-origin endpoint by default so browser requests do not depend on
// cross-origin CORS headers in production.
const WS_URL = `${window.location.origin}/notifications/ws`;

/**
 * Singleton WebSocket service using STOMP over SockJS.
 * Uses only xhr-streaming / xhr-polling transports so the gateway
 * never receives a raw WS-upgrade probe or an iframe request.
 *
 * Usage:
 *   notificationSocket.connect(userId, jwtToken);
 *   const unsub = notificationSocket.onNotification(handler);
 *   unsub();  // stop receiving
 *   notificationSocket.disconnect(); // on logout
 */
class NotificationSocketService {
    constructor() {
        this._client = null;
        this._subscription = null;
        this._currentUserId = null;
        this._handlers = new Set();
        this._reconnectAttempts = 0;
    }

    /**
     * Connect and subscribe to the user's notification topic.
     * @param {string} userId    - logged-in user UUID
     * @param {string} jwtToken  - JWT (sent in STOMP connect headers)
     */
    connect(userId, jwtToken = '') {
        if (!isNotificationEnabled()) {
            console.warn('[WS] Notifications are disabled via feature flag');
            return;
        }

        if (this._client?.active && this._currentUserId === userId) return;

        this._currentUserId = userId;
        this.disconnect();

        const clientConfig = {
            // SockJS over same-origin path.
            webSocketFactory: () =>
                new SockJS(WS_URL, undefined, {
                    // Restrict to HTTP transports to avoid iframe/eventsource noise.
                    transports: ['xhr-streaming', 'xhr-polling'],
                }),
            reconnectDelay: this._getReconnectDelay(),

            // JWT in STOMP CONNECT frame for gateway auth
            connectHeaders: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},

            onConnect: () => {
                this._reconnectAttempts = 0;

                // Always unsubscribe the previous STOMP subscription before creating a new
                // one. Without this, every reconnect adds a duplicate subscription and each
                // incoming message is delivered once per active subscription — causing
                // duplicate toasts and double state updates.
                this._subscription?.unsubscribe();

                this._subscription = this._client.subscribe(
                    `/topic/notifications/${userId}`,
                    (message) => {
                        try {
                            const notification = JSON.parse(message.body);
                            this._handlers.forEach((handler) => handler(notification));
                        } catch {
                            console.warn('[WS] Failed to parse notification payload');
                        }
                    }
                );
            },

            onDisconnect: () => {
                // WebSocket disconnected
            },

            onStompError: (frame) => {
                console.error('[WS] STOMP error:', frame.headers['message']);
                this._reconnectAttempts++;
            },

            onWebSocketClose: () => {
                this._reconnectAttempts++;
            },
        };

        this._client = new Client(clientConfig);

        this._client.activate();
    }

    disconnect() {
        this._subscription?.unsubscribe();
        this._subscription = null;
        if (this._client?.active) {
            this._client.deactivate();
        }
        this._client = null;
        this._currentUserId = null;
    }

    /**
     * Register a handler for every incoming real-time notification.
     * @param {(notification: object) => void} handler
     * @returns {() => void} Unsubscribe function
     */
    onNotification(handler) {
        this._handlers.add(handler);
        return () => this._handlers.delete(handler);
    }

    get isConnected() {
        return this._client?.active ?? false;
    }

    _getReconnectDelay() {
        return Math.min(5000 * Math.pow(2, this._reconnectAttempts), 30_000);
    }
}

export const notificationSocket = new NotificationSocketService();
