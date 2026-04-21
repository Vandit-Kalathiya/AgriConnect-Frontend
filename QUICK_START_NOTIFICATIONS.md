# Quick Start: Notification Feature Flags

## TL;DR - Disable Notifications Locally

1. Create `.env.local` file in project root:
```bash
VITE_ENABLE_NOTIFICATIONS=false
VITE_ENABLE_WEBSOCKET=false
```

2. Restart dev server:
```bash
npm run dev
```

3. Done! Notifications are now disabled.

---

## TL;DR - Enable Notifications

1. In `.env.local`:
```bash
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_WEBSOCKET=true
```

2. Restart dev server:
```bash
npm run dev
```

3. Done! Notifications are now enabled.

---

## Visual Guide

### 🔔 Enabled State
```
Bell Icon: Normal gray, clickable
Badge: Shows "3" (unread count)
Drawer: Full notification list
Toasts: Pop-up notifications appear
```

### 🔕 Disabled State
```
Bell Icon: Grayed out, faded
Badge: Hidden
Drawer: "Notifications Disabled" message
Toasts: No pop-ups
```

---

## Common Scenarios

### Working without Backend
```env
# .env.local
VITE_ENABLE_NOTIFICATIONS=false
```

### Testing Notification Features
```env
# .env.local
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_WEBSOCKET=true
```

### Production Build
```env
# .env.production
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_WEBSOCKET=true
```

---

## Troubleshooting

**Notifications not working?**
1. Check `.env` or `.env.local` file
2. Restart dev server (Ctrl+C, then `npm run dev`)
3. Clear browser cache
4. Check console for warnings

**Changes not applying?**
- Always restart dev server after changing `.env` files
- Vite only reads env files on startup

---

## Files to Check

- `.env.local` - Your local overrides (gitignored)
- `.env.example` - Template with all variables
- `src/config/featureFlags.js` - Feature flag logic

---

## Need More Info?

- Full documentation: `FEATURE_FLAGS.md`
- Implementation details: `NOTIFICATION_FEATURE_FLAG_SUMMARY.md`
