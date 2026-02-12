'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, AlertCircle, Users, Zap, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface EngagementData {
  overall: number;
  attention: number;
  participation: number;
  retention: number;
  activeStudents: number;
  totalStudents: number;
}

interface EngagementMonitorProps {
  data: EngagementData;
  history?: number[];
  onLowEngagement?: () => void;
}

export function EngagementMonitor({
  data,
  history = [],
  onLowEngagement,
}: EngagementMonitorProps) {
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [alertActive, setAlertActive] = useState(false);

  useEffect(() => {
    // Calculate trend
    if (history.length >= 2) {
      const recent = history.slice(-5);
      const avg = recent.reduce((a, b) => a + b) / recent.length;
      const previous = history.slice(-10, -5).reduce((a, b) => a + b, 0) / 5;

      if (avg > previous + 5) setTrend('up');
      else if (avg < previous - 5) setTrend('down');
      else setTrend('stable');
    }

    // Alert if engagement drops below threshold
    if (data.overall < 40) {
      setAlertActive(true);
      onLowEngagement?.();
      setTimeout(() => setAlertActive(false), 5000);
    }
  }, [data.overall, history, onLowEngagement]);

  const getEngagementColor = (level: number): string => {
    if (level >= 75) return 'text-success';
    if (level >= 50) return 'text-primary';
    if (level >= 25) return 'text-warning';
    return 'text-destructive';
  };

  const getEngagementBg = (level: number): string => {
    if (level >= 75) return 'bg-success/20 border-success/50';
    if (level >= 50) return 'bg-primary/20 border-primary/50';
    if (level >= 25) return 'bg-warning/20 border-warning/50';
    return 'bg-destructive/20 border-destructive/50';
  };

  const engagementMetrics = [
    { icon: Eye, label: 'Attention', value: data.attention, color: 'primary' },
    { icon: Zap, label: 'Participation', value: data.participation, color: 'accent' },
    { icon: Activity, label: 'Retention', value: data.retention, color: 'success' },
  ];

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Engagement Card */}
      <Card className={`p-4 border-2 transition-all ${getEngagementBg(data.overall)}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: data.overall > 50 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1, repeat: Infinity }}
              className={`p-3 rounded-lg bg-background/50 border-2 border-background ${getEngagementColor(data.overall)}`}
            >
              <Activity className="w-5 h-5" />
            </motion.div>
            <div>
              <p className="text-sm font-semibold">Class Engagement</p>
              <p className="text-xs text-muted-foreground">{data.activeStudents} of {data.totalStudents} students active</p>
            </div>
          </div>
          <motion.div
            className="flex items-center gap-1"
            animate={{ y: trend === 'up' ? [0, -2, 0] : 0 }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {trend === 'up' && <TrendingUp className="w-4 h-4 text-success" />}
            {trend === 'down' && <TrendingUp className="w-4 h-4 text-destructive rotate-180" />}
            <span className={`text-sm font-bold ${getEngagementColor(data.overall)}`}>{Math.round(data.overall)}%</span>
          </motion.div>
        </div>

        {/* Engagement Bar */}
        <div className="w-full h-3 bg-background/50 rounded-full overflow-hidden border border-border/50">
          <motion.div
            className={`h-full bg-gradient-to-r ${
              data.overall >= 75
                ? 'from-success to-accent'
                : data.overall >= 50
                  ? 'from-primary to-accent'
                  : data.overall >= 25
                    ? 'from-warning to-primary'
                    : 'from-destructive to-warning'
            }`}
            animate={{ width: `${data.overall}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Status Text */}
        <motion.p className="mt-3 text-xs font-medium" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {data.overall >= 75
            ? '✨ Excellent engagement! Keep up the energy.'
            : data.overall >= 50
              ? '👍 Good engagement. Consider adding more interactions.'
              : data.overall >= 25
                ? '⚠️ Engagement dropping. Time to re-engage the class.'
                : '🚨 Critical! Immediate action needed to boost engagement.'}
        </motion.p>
      </Card>

      {/* Individual Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {engagementMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              className="p-3 rounded-lg bg-secondary/20 border border-border/50 hover:border-primary/50 transition"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 text-${metric.color}`} />
                <span className="text-xs font-medium">{metric.label}</span>
              </div>
              <p className={`text-lg font-bold ${getEngagementColor(metric.value)}`}>{Math.round(metric.value)}%</p>
              <div className="w-full h-1 bg-background/50 rounded-full overflow-hidden mt-2">
                <motion.div
                  className={`h-full bg-${metric.color}`}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Engagement History Chart */}
      {history.length > 0 && (
        <Card className="p-4 bg-secondary/10 border-border/50">
          <p className="text-xs font-semibold mb-3">Engagement Trend (Last Minutes)</p>
          <div className="flex items-end h-12 gap-1">
            {history.slice(-10).map((value, index) => (
              <motion.div
                key={index}
                className="flex-1 bg-gradient-to-t from-primary to-accent rounded-sm"
                style={{ height: `${Math.max(10, value)}%` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: index * 0.05 }}
                title={`${value}%`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Each bar represents one minute of class</p>
        </Card>
      )}

      {/* Alert - Low Engagement */}
      {alertActive && (
        <motion.div
          className="p-4 rounded-lg bg-warning/20 border-2 border-warning/50 flex items-start gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-warning">Engagement Alert!</p>
            <p className="text-xs text-muted-foreground mt-1">
              Class engagement is dropping. Try adding an interactive question, real-world example, or break from the current topic.
            </p>
            <div className="mt-3 flex gap-2">
              <button className="text-xs font-medium px-3 py-1 rounded bg-warning/20 border border-warning/50 hover:bg-warning/30 transition">
                Ask Question
              </button>
              <button className="text-xs font-medium px-3 py-1 rounded bg-warning/20 border border-warning/50 hover:bg-warning/30 transition">
                Add Example
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      <Card className="p-4 bg-primary/5 border border-primary/30">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Engagement Tips</p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>✓ Use rural examples relevant to students' daily life</li>
              <li>✓ Ask questions frequently to check understanding</li>
              <li>✓ Change tone and expression when explaining</li>
              <li>✓ Keep explanations short (max 2 minutes)</li>
              <li>✓ Use gestures and movement to hold attention</li>
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
