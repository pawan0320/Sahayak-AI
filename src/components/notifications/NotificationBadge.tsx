'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useNotifications } from './NotificationContext';

interface NotificationBadgeProps {
  className?: string;
  onClick?: () => void;
}

export function NotificationBadge({ className = '', onClick }: NotificationBadgeProps) {
  const { unreadCount, notifications } = useNotifications();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative p-2 rounded-lg hover:bg-slate-700/50 transition ${className}`}
      title={`${unreadCount} new notifications`}
    >
      <Bell className='w-5 h-5 text-slate-400 hover:text-white transition' />
      
      {/* Unread Badge */}
      {unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className='absolute top-0 right-0 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center'
        >
          <span className='text-white text-xs font-bold'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        </motion.div>
      )}

      {/* Pulse Animation for Pending */}
      {notifications.filter((n) => n.status === 'pending').length > 0 && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className='absolute inset-0 rounded-lg border border-red-500'
        />
      )}
    </motion.button>
  );
}

export default NotificationBadge;
