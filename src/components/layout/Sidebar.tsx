'use client';

import { motion } from 'framer-motion';
import { Bot, LayoutDashboard, BookOpen, Users, BarChart3, MessageSquare, Settings, LogOut, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  userRole?: 'teacher' | 'student' | 'admin';
}

export function Sidebar({ userRole = 'teacher' }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = {
    teacher: [
      { icon: Home, label: 'Home', href: '/' },
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
      { icon: BookOpen, label: 'Lessons', href: '/lessons' },
      { icon: Users, label: 'Groups', href: '/groups' },
      { icon: BarChart3, label: 'Analytics', href: '/analytics' },
      { icon: MessageSquare, label: 'AI Assistant', href: '/assistant' },
      { icon: Settings, label: 'Settings', href: '/settings' },
    ],
    student: [
      { icon: Home, label: 'Home', href: '/' },
      { icon: LayoutDashboard, label: 'Dashboard', href: '/student/dashboard' },
      { icon: BookOpen, label: 'Lessons', href: '/student/lessons' },
      { icon: BarChart3, label: 'Progress', href: '/student/progress' },
      { icon: Settings, label: 'Settings', href: '/settings' },
    ],
    admin: [
      { icon: Home, label: 'Home', href: '/' },
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
      { icon: Users, label: 'Users', href: '/admin/users' },
      { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
      { icon: Settings, label: 'Settings', href: '/admin/settings' },
    ],
  };

  const items = menuItems[userRole];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col overflow-y-auto"
    >
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg group-hover:shadow-lg group-hover:shadow-primary/20 transition">
            <Bot className="w-6 h-6 text-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sahayak
            </h1>
            <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'group-hover:text-accent'} transition`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
