'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Users, TrendingUp, AlertTriangle, Zap, BookOpen, BarChart3 } from 'lucide-react';

interface DashboardWidgetProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number | string;
    direction: 'up' | 'down';
  };
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'destructive';
  delay?: number;
}

const colorClasses = {
  primary: 'from-primary/20 to-primary/10',
  accent: 'from-accent/20 to-accent/10',
  success: 'from-success/20 to-success/10',
  warning: 'from-warning/20 to-warning/10',
  destructive: 'from-destructive/20 to-destructive/10',
};

const iconColorClasses = {
  primary: 'text-primary',
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
};

export function DashboardWidget({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  delay = 0,
}: DashboardWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, translateY: -4 }}
    >
      <Card className="p-6 h-full bg-gradient-to-br from-background to-secondary/20 border-border/50 hover:border-primary/50 transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} group-hover:shadow-lg transition-all`}>
            <div className={iconColorClasses[color]}>
              {icon}
            </div>
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-semibold ${
                trend.direction === 'up'
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
            </div>
          )}
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-2">{title}</h3>
        <p className="text-3xl font-bold mb-4">{value}</p>

        <div className="h-1 bg-primary/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: delay + 0.3 }}
            className={`h-full bg-gradient-to-r from-${color} to-accent`}
          />
        </div>
      </Card>
    </motion.div>
  );
}

export function StatItem({
  label,
  value,
  icon,
  color = 'primary',
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'destructive';
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20">
      <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
        <div className={iconColorClasses[color]}>
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export function QuickActionButton({
  label,
  icon,
  onClick,
  color = 'primary',
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'destructive';
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`w-full p-4 rounded-lg border-2 transition-all group ${
        color === 'primary'
          ? 'border-primary/30 hover:border-primary/50 hover:bg-primary/5'
          : color === 'accent'
            ? 'border-accent/30 hover:border-accent/50 hover:bg-accent/5'
            : 'border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-center justify-center gap-2 text-sm font-medium">
        <div className={`${color === 'primary' ? 'text-primary' : color === 'accent' ? 'text-accent' : 'text-foreground'} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        {label}
      </div>
    </motion.button>
  );
}
