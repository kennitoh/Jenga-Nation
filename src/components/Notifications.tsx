import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bell, CheckCheck } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/button';
import {
    LiveNotification,
    fetchNotifications,
    getCurrentUserId,
    markAllNotificationsRead,
    markNotificationRead,
    relativeTime,
} from '../lib/issues';

interface NotificationsProps {
    onBack: () => void;
    onOpenIssue: (id: number) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onBack, onOpenIssue }) => {
    const [items, setItems] = useState<LiveNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        fetchNotifications().then(rows => {
            if (!cancelled) {
                setItems(rows);
                setLoading(false);
            }
        });
        return () => { cancelled = true; };
    }, []);

    const unread = items.filter(n => !n.isRead).length;

    const handleOpen = async (n: LiveNotification) => {
        if (!n.isRead) {
            setItems(prev => prev.map(x => (x.id === n.id ? { ...x, isRead: true } : x)));
            markNotificationRead(n.id);
        }
        if (n.issueId) onOpenIssue(n.issueId);
    };

    const handleMarkAll = async () => {
        const uid = await getCurrentUserId();
        if (!uid) return;
        setItems(prev => prev.map(x => ({ ...x, isRead: true })));
        await markAllNotificationsRead(uid);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-700" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
                            <p className="text-sm text-slate-600">{unread > 0 ? `${unread} unread` : 'You are all caught up'}</p>
                        </div>
                    </div>
                    {unread > 0 && (
                        <Button variant="outline" size="sm" className="gap-1" onClick={handleMarkAll}>
                            <CheckCheck className="w-4 h-4" /> Mark all read
                        </Button>
                    )}
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-6 space-y-3">
                {loading && <p className="text-center text-slate-500 py-10">Loading...</p>}

                {!loading && items.length === 0 && (
                    <Card className="p-8 text-center space-y-2">
                        <Bell className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="text-slate-600">No notifications yet. You'll be told when a report you made is reviewed or answered.</p>
                    </Card>
                )}

                {items.map(n => (
                    <Card
                        key={n.id}
                        onClick={() => handleOpen(n)}
                        className={`p-4 cursor-pointer transition-colors ${n.isRead ? 'bg-white' : 'bg-blue-50 border border-blue-100'}`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.isRead ? 'bg-transparent' : 'bg-blue-600'}`} />
                            <div className="flex-1">
                                <p className="font-medium text-slate-800">{n.title}</p>
                                {n.body && <p className="text-sm text-slate-600 mt-1">{n.body}</p>}
                                <p className="text-xs text-slate-400 mt-2">{relativeTime(n.createdAt)}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
