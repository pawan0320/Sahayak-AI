'use client';

import { motion } from 'framer-motion';
import { Bell, User, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface HeaderProps {
  title?: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
}

export function Header({ title = 'Dashboard', showMenu = false, onMenuClick }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          {showMenu && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-secondary rounded-lg transition"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {title}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-secondary rounded-lg transition"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
            </button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute top-12 right-0 w-80 bg-card border border-border rounded-lg shadow-lg p-4 space-y-2 max-h-96 overflow-y-auto"
              >
                <p className="text-sm font-semibold mb-4">Notifications</p>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 bg-secondary/50 rounded-lg text-sm hover:bg-secondary transition cursor-pointer">
                    <p className="font-medium">Notification {i}</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-secondary rounded-lg transition"
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          {/* Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 pl-4 border-l border-border"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-4 h-4 text-foreground" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">Teacher Name</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
