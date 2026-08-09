import React, { useState } from 'react';
import { NotificationItem } from '../types';
import { Bell, Check, X, CheckSquare, Calendar, Sparkles } from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'New Action Item Assigned',
      message: 'කසුන් පෙරේරා assigned you: "Configure AWS KMS Envelope Encryption"',
      isRead: false,
      type: 'TASK_ASSIGNED',
      createdAt: '10 mins ago'
    },
    {
      id: 'n-2',
      title: 'Upcoming Meeting Reminder',
      message: 'Sprint Alignment starting in 15 minutes',
      isRead: false,
      type: 'MEETING_REMINDER',
      createdAt: '1 hour ago'
    },
    {
      id: 'n-3',
      title: 'AI Processing Complete',
      message: 'Whisper audio transcription & summary ready for Marketing Campaign Sync',
      isRead: true,
      type: 'SYSTEM',
      createdAt: 'Yesterday'
    }
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 shadow-2xs transition-all relative"
        title="Notifications"
      >
        <Bell className="w-4 h-4 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-900 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50 space-y-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-slate-800" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Notifications</h4>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] text-slate-600 hover:text-slate-900 font-semibold"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                  item.isRead
                    ? 'bg-gray-50 border-gray-200 text-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5 text-slate-900">
                    {item.type === 'TASK_ASSIGNED' ? (
                      <CheckSquare className="w-3.5 h-3.5 text-slate-700" />
                    ) : (
                      <Calendar className="w-3.5 h-3.5 text-slate-700" />
                    )}
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.createdAt}</span>
                </div>
                <p className="text-slate-600 leading-normal">{item.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
