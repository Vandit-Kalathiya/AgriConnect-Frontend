import React, { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { notificationSocket } from '../../services/notificationSocket';
import { useNotificationStore } from '../../stores/notificationStore';

/* ─── Constants ──────────────────────────────────────────────────────────── */

const AUTO_DISMISS_MS = 5500;
const MAX_VISIBLE     = 4;

/* ─── Event-type metadata with per-type accent colours ───────────────────── */

const EVENT_META = {
    USER_REGISTERED:     { icon: '👤', label: 'Welcome to AgriConnect!',      accent: 'border-green-500',   progress: 'bg-green-500',   iconBg: 'bg-green-50',    iconRing: 'ring-green-200' },
    ORDER_PLACED:        { icon: '🛒', label: 'Your order has been placed',    accent: 'border-blue-500',    progress: 'bg-blue-500',    iconBg: 'bg-blue-50',     iconRing: 'ring-blue-200' },
    LISTING_CREATED:     { icon: '📋', label: 'New listing published',         accent: 'border-teal-500',    progress: 'bg-teal-500',    iconBg: 'bg-teal-50',     iconRing: 'ring-teal-200' },
    LISTING_UPDATED:     { icon: '✏️',  label: 'Listing updated',               accent: 'border-orange-400',  progress: 'bg-orange-400',  iconBg: 'bg-orange-50',   iconRing: 'ring-orange-200' },
    CONTRACT_SIGNED:     { icon: '📝', label: 'Contract signed successfully',  accent: 'border-violet-500',  progress: 'bg-violet-500',  iconBg: 'bg-violet-50',   iconRing: 'ring-violet-200' },
    CONTRACT_CREATED:    { icon: '📄', label: 'New contract created',          accent: 'border-violet-400',  progress: 'bg-violet-400',  iconBg: 'bg-violet-50',   iconRing: 'ring-violet-200' },
    AGREEMENT_SIGNED:    { icon: '✅', label: 'Agreement signed',              accent: 'border-emerald-500', progress: 'bg-emerald-500', iconBg: 'bg-emerald-50',  iconRing: 'ring-emerald-200' },
    AGREEMENT_GENERATED: { icon: '📜', label: 'Agreement document ready',     accent: 'border-emerald-400', progress: 'bg-emerald-400', iconBg: 'bg-emerald-50',  iconRing: 'ring-emerald-200' },
    STORAGE_BOOKED:      { icon: '🏪', label: 'Storage booking confirmed',    accent: 'border-amber-500',   progress: 'bg-amber-500',   iconBg: 'bg-amber-50',    iconRing: 'ring-amber-200' },
    PAYMENT_RECEIVED:    { icon: '💰', label: 'Payment received',              accent: 'border-green-600',   progress: 'bg-green-600',   iconBg: 'bg-green-50',    iconRing: 'ring-green-200' },
    MARKET_TEST_EVENT:   { icon: '🔔', label: 'Test notification',             accent: 'border-green-400',   progress: 'bg-green-400',   iconBg: 'bg-gray-50',     iconRing: 'ring-gray-200' },
};

const DEFAULT_META = {
    icon: '🔔', label: 'New notification',
    accent: 'border-green-500', progress: 'bg-green-500', iconBg: 'bg-green-50', iconRing: 'ring-green-200',
};

/* ─── Individual toast card ──────────────────────────────────────────────── */

const ToastItem = ({ id, notification, onDismiss, onView }) => {
    const [paused,  setPaused]  = useState(false);
    const [exiting, setExiting] = useState(false);

    // Per-toast timer that supports pause / resume
    const remainingRef = useRef(AUTO_DISMISS_MS);
    const startRef     = useRef(Date.now());
    const timerRef     = useRef(null);

    const meta = EVENT_META[notification?.eventType] ?? DEFAULT_META;

    const triggerDismiss = () => {
        setExiting(true);
        setTimeout(() => onDismiss(id), 260);
    };

    const startTimer = (delay) => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(triggerDismiss, delay);
        startRef.current = Date.now();
    };

    useEffect(() => {
        startTimer(AUTO_DISMISS_MS);
        return () => clearTimeout(timerRef.current);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleMouseEnter = () => {
        clearTimeout(timerRef.current);
        remainingRef.current = Math.max(
            0,
            remainingRef.current - (Date.now() - startRef.current)
        );
        setPaused(true);
    };

    const handleMouseLeave = () => {
        startTimer(remainingRef.current);
        setPaused(false);
    };

    const handleView = () => {
        onView();
        triggerDismiss();
    };

    const source = notification?.sourceService
        ?.replace(/-/g, ' ')
        ?.replace(/\b\w/g, (c) => c.toUpperCase()) ?? '';

    return (
        <div
            className={`
                group relative bg-white rounded-2xl overflow-hidden
                border border-gray-100 border-l-4 ${meta.accent}
                shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)]
                hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.18)]
                hover:-translate-y-0.5
                transition-all duration-200 ease-out
                pointer-events-auto w-full max-w-[360px]
            `}
            style={{
                animation: exiting
                    ? 'toastOut 0.26s ease-in forwards'
                    : 'toastIn 0.35s cubic-bezier(0.21,1.02,0.73,1) forwards',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Body */}
            <div className="flex items-center gap-3 px-4 py-3">
                {/* Icon bubble */}
                <div className={`
                    shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                    text-[18px] select-none ring-1 ${meta.iconBg} ${meta.iconRing}
                `}>
                    {meta.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-gray-800 leading-snug truncate">
                        {meta.label}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                        {source && (
                            <>
                                <span className="text-[11px] text-gray-400">{source}</span>
                                <span className="text-gray-300 text-[10px]">·</span>
                            </>
                        )}
                        <span className="text-[11px] text-gray-400">just now</span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        onClick={handleView}
                        className="
                            hidden group-hover:inline-flex items-center gap-1
                            text-[11px] font-semibold text-green-600 hover:text-green-700
                            bg-green-50 hover:bg-green-100
                            px-2.5 py-1 rounded-lg transition-colors
                        "
                    >
                        View
                    </button>
                    <button
                        onClick={triggerDismiss}
                        className="
                            w-6 h-6 flex items-center justify-center rounded-full
                            text-gray-300 hover:text-gray-500 hover:bg-gray-100
                            transition-colors
                        "
                        aria-label="Dismiss"
                    >
                        <FaTimes size={9} />
                    </button>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-[3px] bg-gray-100">
                <div
                    className={`h-full ${meta.progress}`}
                    style={{
                        animation: `toastProgress ${AUTO_DISMISS_MS}ms linear forwards`,
                        animationPlayState: paused ? 'paused' : 'running',
                    }}
                />
            </div>
        </div>
    );
};

/* ─── Container ──────────────────────────────────────────────────────────── */

const NotificationToast = () => {
    const [toasts, setToasts] = useState([]);
    const { openDrawer }      = useNotificationStore();

    useEffect(() => {
        const unsubscribe = notificationSocket.onNotification((notification) => {
            const toastId = `toast-${notification?.id ?? Date.now()}`;
            setToasts((prev) => {
                // Deduplicate: same notification ID should never produce two toasts
                // (guards against any residual duplicate socket delivery)
                if (prev.some((t) => t.id === toastId)) return prev;
                const next = [...prev, { id: toastId, notification }];
                return next.length > MAX_VISIBLE ? next.slice(next.length - MAX_VISIBLE) : next;
            });
        });
        return unsubscribe;
    }, []);

    const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

    if (toasts.length === 0) return null;

    return (
        <>
            <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[200] pointer-events-none w-[360px]">
                {toasts.map(({ id, notification }) => (
                    <ToastItem
                        key={id}
                        id={id}
                        notification={notification}
                        onDismiss={dismiss}
                        onView={openDrawer}
                    />
                ))}
            </div>

            <style>{`
                @keyframes toastIn {
                    0%   { transform: translateX(calc(100% + 24px)); opacity: 0; }
                    60%  { opacity: 1; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                @keyframes toastOut {
                    0%   { transform: translateX(0);              opacity: 1; }
                    100% { transform: translateX(calc(100% + 24px)); opacity: 0; }
                }
                @keyframes toastProgress {
                    from { width: 100%; }
                    to   { width: 0%;   }
                }
            `}</style>
        </>
    );
};

export default NotificationToast;
