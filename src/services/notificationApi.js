import api from '../config/axiosInstance';
import { API_CONFIG } from '../config/apiConfig';

const BASE = `${API_CONFIG.NOTIFICATION_SERVICE}/api/notifications`;

/** Fetch paginated IN_APP notifications for a user. */
export const fetchNotifications = (userId, page = 0, size = 20) =>
    api
        .get(BASE, { params: { userId, page, size, channel: 'IN_APP' } })
        .then((r) => r.data);

/** Fetch the unread notification badge count for a user. */
export const fetchUnreadCount = (userId) =>
    api
        .get(`${BASE}/unread-count`, { params: { userId } })
        .then((r) => r.data?.count ?? 0);

/** Mark a single notification as read. */
export const markAsRead = (id) =>
    api.patch(`${BASE}/${id}/read`).then((r) => r.data);

/** Mark all notifications as read for a user. */
export const markAllAsRead = (userId) =>
    api
        .patch(`${BASE}/read-all`, null, { params: { userId } })
        .then((r) => r.data);

/** Delete a single notification. */
export const deleteNotification = (id, userId) =>
    api.delete(`${BASE}/${id}`, { params: { userId } });

/** Admin statistics endpoint. */
export const fetchNotificationStats = () =>
    api.get(`${BASE}/stats`).then((r) => r.data);
