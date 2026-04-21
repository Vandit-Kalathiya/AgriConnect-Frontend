# Notification System Architecture with Feature Flags

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        .env / .env.local                        │
│  VITE_ENABLE_NOTIFICATIONS=true/false                          │
│  VITE_ENABLE_WEBSOCKET=true/false                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              src/config/featureFlags.js                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ isNotificationEnabled()                                  │  │
│  │ getNotificationDisabledReason()                          │  │
│  │ FEATURE_FLAGS.ENABLE_NOTIFICATIONS                       │  │
│  │ FEATURE_FLAGS.ENABLE_WEBSOCKET                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ├─────────────────┬─────────────────┬──────────────┐
                           ▼                 ▼                 ▼              ▼
                    ┌──────────────┐  ┌─────────────┐  ┌──────────┐  ┌──────────┐
                    │ Socket       │  │ Store       │  │ Drawer   │  │ Navbar   │
                    │ Service      │  │ (Zustand)   │  │ UI       │  │ UI       │
                    └──────────────┘  └─────────────┘  └──────────┘  └──────────┘
```

## Component Interaction Flow

### When Notifications are ENABLED ✅

```
User Login
    │
    ▼
Navbar.jsx (fetchUser)
    │
    ├─> initForUser(userId, jwtToken)
    │       │
    │       ▼
    │   notificationStore.js
    │       │
    │       ├─> Check: isNotificationEnabled() ✅ TRUE
    │       │
    │       ├─> loadNotifications() → API Call
    │       │
    │       ├─> refreshUnreadCount() → API Call
    │       │
    │       └─> notificationSocket.connect()
    │               │
    │               ▼
    │           notificationSocket.js
    │               │
    │               ├─> Check: isNotificationEnabled() ✅ TRUE
    │               │
    │               ├─> Create SockJS connection
    │               │
    │               ├─> Subscribe to /topic/notifications/{userId}
    │               │
    │               └─> onNotification() handlers registered
    │                       │
    │                       ├─> notificationStore.addIncoming()
    │                       │       │
    │                       │       └─> Update state, increment badge
    │                       │
    │                       └─> NotificationToast component
    │                               │
    │                               └─> Show toast popup
    │
    └─> Navbar renders
            │
            ├─> Bell icon: Normal color, clickable
            │
            └─> Badge: Shows unread count
```

### When Notifications are DISABLED 🔕

```
User Login
    │
    ▼
Navbar.jsx (fetchUser)
    │
    ├─> initForUser(userId, jwtToken)
    │       │
    │       ▼
    │   notificationStore.js
    │       │
    │       ├─> Check: isNotificationEnabled() ❌ FALSE
    │       │
    │       ├─> Set isEnabled = false
    │       │
    │       ├─> Set disabledReason = "Notifications are disabled..."
    │       │
    │       └─> RETURN EARLY (no API calls, no WebSocket)
    │
    └─> Navbar renders
            │
            ├─> Bell icon: Grayed out, faded
            │
            └─> Badge: Hidden
```

## State Management

### notificationStore.js State

```javascript
{
  // Data
  notifications: [],        // Array of notification objects
  unreadCount: 0,          // Badge count
  totalPages: 1,           // Pagination
  currentPage: 0,          // Current page
  
  // UI State
  isLoading: false,        // Loading spinner
  isLoadingMore: false,    // Load more spinner
  isDrawerOpen: false,     // Drawer visibility
  error: null,             // Error message
  
  // Feature Flag State ⭐ NEW
  isEnabled: true/false,   // Is notification system enabled?
  disabledReason: string,  // Why is it disabled?
}
```

## WebSocket Connection Lifecycle

### Enabled State
```
App Start
    │
    ▼
User Login → initForUser()
    │
    ▼
notificationSocket.connect(userId, jwt)
    │
    ├─> Feature Flag Check ✅
    │
    ├─> Create SockJS client
    │
    ├─> Configure STOMP
    │
    ├─> Activate connection
    │
    ├─> onConnect: Subscribe to topic
    │
    ├─> Receive messages → handlers
    │
    └─> User Logout → disconnect()
```

### Disabled State
```
App Start
    │
    ▼
User Login → initForUser()
    │
    ▼
notificationSocket.connect(userId, jwt)
    │
    ├─> Feature Flag Check ❌
    │
    ├─> Log warning to console
    │
    └─> RETURN (no connection created)
```

## UI Component States

### Notification Bell (Navbar)

| State | Icon Color | Opacity | Cursor | Badge | Tooltip |
|-------|-----------|---------|--------|-------|---------|
| Enabled + No Unread | Gray | 100% | Pointer | Hidden | "Open notifications" |
| Enabled + Unread | Gray | 100% | Pointer | Red (count) | "Open notifications" |
| Disabled | Gray | 60% | Not-allowed | Hidden | "Notifications are disabled" |

### Notification Drawer

| State | Content |
|-------|---------|
| Enabled + Loading | Skeleton loaders |
| Enabled + Error | Error message + Retry button |
| Enabled + Empty | "You're all caught up!" |
| Enabled + Data | Notification list |
| **Disabled** | **"Notifications Disabled" message + .env hint** |

### Toast Notifications

| State | Behavior |
|-------|----------|
| Enabled | Toasts appear for incoming notifications |
| **Disabled** | **No toasts rendered (useEffect returns early)** |

## API Calls Summary

### When Enabled ✅
```
✓ GET /api/notifications?userId={id}&page=0&size=20
✓ GET /api/notifications/unread-count?userId={id}
✓ PATCH /api/notifications/{id}/read
✓ PATCH /api/notifications/read-all?userId={id}
✓ DELETE /api/notifications/{id}?userId={id}
✓ WebSocket: /notifications/ws
```

### When Disabled ❌
```
✗ No API calls made
✗ No WebSocket connection
✗ Zero network overhead
```

## Environment Variable Precedence

```
.env.local          (Highest priority - gitignored)
    ↓
.env.development    (Development mode)
    ↓
.env.production     (Production mode)
    ↓
.env                (Base configuration)
    ↓
.env.example        (Template only - not loaded)
```

## Feature Flag Decision Tree

```
                    App Starts
                        │
                        ▼
            Read VITE_ENABLE_NOTIFICATIONS
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
    true/1/undefined                false/0
        │                               │
        ▼                               ▼
Read VITE_ENABLE_WEBSOCKET      Set isEnabled = false
        │                       Set disabledReason
        │                       Skip initialization
        │                               │
┌───────┴────────┐                     ▼
▼                ▼                 Render disabled UI
true/1      false/0
│               │
▼               ▼
Full        Disabled
Features    (fallback)
```

## Security Considerations

1. **No Sensitive Data in .env**: Feature flags are boolean, no secrets
2. **Client-Side Only**: These flags control UI/UX, not backend security
3. **JWT Still Required**: When enabled, WebSocket still requires valid JWT
4. **Backend Validation**: Backend must validate all requests independently

## Performance Impact

### Enabled
- WebSocket connection: ~1 persistent connection
- Polling: None (real-time via WebSocket)
- Memory: ~50KB for notification state

### Disabled
- WebSocket connection: 0
- API calls: 0
- Memory: ~1KB (minimal state)
- **Performance gain**: No network overhead

## Debugging Tips

### Check Feature Flag Status
```javascript
// In browser console
console.log(import.meta.env.VITE_ENABLE_NOTIFICATIONS);
console.log(import.meta.env.VITE_ENABLE_WEBSOCKET);
```

### Check Store State
```javascript
// In browser console (with React DevTools)
// Find NotificationStore in Components tab
// Or add temporary logging:
console.log(useNotificationStore.getState());
```

### Check WebSocket Connection
```
1. Open DevTools → Network tab
2. Filter: WS (WebSocket)
3. Look for: /notifications/ws
4. Status: 101 Switching Protocols (if enabled)
```

## Migration Path

### From Always-On to Feature-Flagged

Before:
```javascript
// Always connected
notificationSocket.connect(userId, jwt);
```

After:
```javascript
// Conditionally connected
if (isNotificationEnabled()) {
  notificationSocket.connect(userId, jwt);
}
```

## Future Enhancements

1. **Per-User Preferences**: Store in user profile
2. **Notification Channels**: Email, SMS, Push, In-App flags
3. **Granular Controls**: Per-event-type toggles
4. **Admin Dashboard**: Runtime feature flag management
5. **Analytics**: Track feature usage and performance

---

**Last Updated:** April 21, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
