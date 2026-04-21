const getFeatureFlag = (flagName, defaultValue = false) => {
    const envValue = import.meta.env[flagName];
    if (envValue === undefined || envValue === null) {
        return defaultValue;
    }
    if (typeof envValue === 'string') {
        return envValue.toLowerCase() === 'true' || envValue === '1';
    }
    return Boolean(envValue);
};

export const FEATURE_FLAGS = {
    ENABLE_NOTIFICATIONS: getFeatureFlag('VITE_ENABLE_NOTIFICATIONS', true),
    ENABLE_WEBSOCKET: getFeatureFlag('VITE_ENABLE_WEBSOCKET', true),
};

export const isNotificationEnabled = () => {
    return FEATURE_FLAGS.ENABLE_NOTIFICATIONS && FEATURE_FLAGS.ENABLE_WEBSOCKET;
};

export const getNotificationDisabledReason = () => {
    if (!FEATURE_FLAGS.ENABLE_NOTIFICATIONS) {
        return 'Notifications are currently disabled in this environment.';
    }
    if (!FEATURE_FLAGS.ENABLE_WEBSOCKET) {
        return 'Real-time notifications are disabled (WebSocket unavailable).';
    }
    return null;
};
