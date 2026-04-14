"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

interface NotificationButtonProps {
    userId: string;
}

type NotificationItem = {
    _id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
};

export const NotificationButton = ({ userId }: NotificationButtonProps) => {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<NotificationItem[]>([]);
    const [unread, setUnread] = useState(0);

    const loadNotifications = async () => {
        const res = await fetch("/api/notifications", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setItems(data.notifications || []);
        setUnread(data.unreadCount || 0);
    };

    const onMarkRead = async () => {
        try {
            const res = await fetch("/api/notifications/read", {
                method: "PATCH",
                credentials: "include",
            });
            if (!res.ok) return;
            setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
            setUnread(0);
        } catch {
            toast.error("Failed to mark notifications as read");
        }
    };

    const hasUnread = useMemo(() => unread > 0, [unread]);

    return (
        <div className="relative hidden md:block">
            <button
                onClick={async () => {
                    const nextOpen = !open;
                    setOpen(nextOpen);
                    if (nextOpen) {
                        try {
                            await loadNotifications();
                        } catch {
                            toast.error("Failed to load notifications");
                        }
                    }
                }}
                className="relative inline-flex items-center gap-2 rounded-lg border border-cyan-200/30 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition-all duration-200 hover:bg-cyan-300/20"
                title="Notifications"
            >
                <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {hasUnread && (
                    <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                        {unread > 9 ? "9+" : unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/15 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl">
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold text-cyan-100">Notifications</p>
                        <button onClick={onMarkRead} className="text-xs font-semibold text-cyan-300">
                            Mark all read
                        </button>
                    </div>

                    <div className="max-h-80 space-y-2 overflow-y-auto">
                        {items.length === 0 ? (
                            <p className="rounded-lg bg-white/5 p-3 text-xs text-slate-300">No notifications yet.</p>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item._id}
                                    className={`rounded-lg border p-3 ${item.isRead ? "border-white/10 bg-white/5" : "border-cyan-200/30 bg-cyan-400/10"}`}
                                >
                                    <p className="text-xs font-semibold text-white">{item.title}</p>
                                    <p className="mt-1 text-xs text-slate-200">{item.message}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <Link
                        href={`/profile/${userId}`}
                        onClick={() => setOpen(false)}
                        className="mt-3 block rounded-lg border border-cyan-200/30 px-3 py-2 text-center text-xs font-semibold text-cyan-100"
                    >
                        Open profile
                    </Link>
                </div>
            )}
        </div>
    );
};
