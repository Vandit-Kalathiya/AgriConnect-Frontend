# Feature Flags Documentation

## Notification System Feature Flags

The notification system can be controlled via environment variables to enable or disable real-time notifications and WebSocket connections. This is particularly useful for local development, testing, or environments where WebSocket connections are not available.

## Configuration

### Environment Variables

Add these variables to your `.env` file:

```env
# Enable/disable real-time notifications (default: true)
VITE_ENABLE_NOTIFICATIONS=true

# Enable/disable WebSocket connections (default: true)
VITE_ENABLE_WEBSOCKET=true
```

### Values

- `true` or `1` - Feature is enabled
- `false` or `0` - Feature is disabled
- If not set, defaults to `true` (enabled)

## How It Works

### When Notifications are Enabled (`true`)

1. **WebSocket Connection**: Automatically connects to the notification service via WebSocket
2. **Real-time Updates**: Receives live notifications from the backend
3. **Notification Badge**: Shows unread count on the notification bell icon
4. **Notification Drawer**: Displays all notifications with full functionality
5. **Toast Notifications**: Shows real-time toast messages for incoming notifications

### When Notifications are Disabled (`false`)

1. **No WebSocket Connection**: WebSocket connection is not established
2. **Disabled UI State**: Notification bell icon appears grayed out with reduced opacity
3. **Informative Message**: Clicking the bell shows a message explaining notifications are disabled
4. **No API Calls**: Prevents unnecessary API calls to the notification service
5. **Console Warning**: Logs a warning message in the browser console

## Use Cases

### Local Development
```env
# Disable notifications when backend notification service is not running
VITE_ENABLE_NOTIFICATIONS=false
VITE_ENABLE_WEBSOCKET=false
```

### Testing Without Notifications
```env
# Test the app without notification distractions
VITE_ENABLE_NOTIFICATIONS=false
```

### Production
```env
# Enable all notification features
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_WEBSOCKET=true
```

## Implementation Details

### Files Modified

1. **`src/config/featureFlags.js`** - Feature flag configuration and utilities
2. **`src/services/notificationSocket.js`** - WebSocket service with feature flag check
3. **`src/stores/notificationStore.js`** - Zustand store with disabled state management
4. **`src/Component/Notifications/NotificationDrawer.jsx`** - UI for disabled state
5. **`src/Component/Navbar/Navbar.jsx`** - Conditional notification bell styling

### Feature Flag Functions

```javascript
import { isNotificationEnabled, getNotificationDisabledReason } from './config/featureFlags';

// Check if notifications are enabled
if (isNotificationEnabled()) {
  // Initialize notification system
}

// Get reason why notifications are disabled
const reason = getNotificationDisabledReason();
// Returns: "Notifications are currently disabled in this environment."
```

## Troubleshooting

### Notifications Not Working

1. Check your `.env` file has the correct values
2. Restart the development server after changing `.env` values
3. Clear browser cache and reload
4. Check browser console for warning messages

### WebSocket Connection Issues

```env
# Try disabling WebSocket if connection fails
VITE_ENABLE_WEBSOCKET=false
```

### Environment Not Loading

- Ensure `.env` file is in the project root
- Variable names must start with `VITE_` for Vite to expose them
- Restart the dev server after creating/modifying `.env`

## Best Practices

1. **Always set in `.env`**: Don't hardcode feature flags in the code
2. **Document changes**: Update this file when adding new feature flags
3. **Default to enabled**: Production should have notifications enabled by default
4. **Test both states**: Test your app with notifications both enabled and disabled
5. **Use `.env.local`**: For local overrides, create `.env.local` (not committed to git)

## Adding New Feature Flags

To add a new feature flag:

1. Add the environment variable to `.env.example`
2. Add the flag to `src/config/featureFlags.js`
3. Update this documentation
4. Implement the conditional logic in your components

Example:
```javascript
// In featureFlags.js
export const FEATURE_FLAGS = {
  ENABLE_NOTIFICATIONS: getFeatureFlag('VITE_ENABLE_NOTIFICATIONS', true),
  ENABLE_WEBSOCKET: getFeatureFlag('VITE_ENABLE_WEBSOCKET', true),
  ENABLE_NEW_FEATURE: getFeatureFlag('VITE_ENABLE_NEW_FEATURE', false),
};
```
