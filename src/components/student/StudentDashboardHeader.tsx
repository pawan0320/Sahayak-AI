'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle,
  BarChart3,
  MessageSquare,
  Calendar,
  TrendingUp,
  AlertCircle,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface StudentDashboardHeaderProps {
  studentName: string;
  grade: string;
  schoolName: string;
  className: string;
  todayLesson?: {
    topic: string;
    time: string;
    status: 'upcoming' | 'ongoing' | 'completed';
  };
}

export function StudentDashboardHeader({
  studentName,
  grade,
  schoolName,
  className,
  todayLesson,
}: StudentDashboardHeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-accent to-primary/80 p-8 text-white shadow-lg">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Welcome, {studentName}! 👋
              </h1>
              <p className="text-white/80">Grade {grade} • {className} • {schoolName}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{currentTime}</div>
              <div className="text-sm text-white/70">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Today's lesson status */}
          {todayLesson && (
            <motion.div
              className={`p-3 rounded-lg backdrop-blur-sm flex items-center justify-between ${
                todayLesson.status === 'ongoing'
                  ? 'bg-white/20 border border-white/40'
                  : 'bg-white/10 border border-white/20'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <div>
                  <p className="text-sm font-semibold">Today's Class</p>
                  <p className="text-xs text-white/70">{todayLesson.topic}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold">{todayLesson.time}</span>
                {todayLesson.status === 'ongoing' && (
                  <motion.div
                    className="w-3 h-3 rounded-full bg-success"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: BookOpen, label: 'Notes', value: '12', color: 'primary' },
          { icon: CheckCircle, label: 'Attendance', value: '95%', color: 'success' },
          { icon: BarChart3, label: 'Quiz Avg', value: '8.5/10', color: 'accent' },
          { icon: TrendingUp, label: 'Growth', value: '+12%', color: 'warning' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-3 text-center group hover:shadow-md transition">
              <div className="flex justify-center mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    stat.color === 'primary'
                      ? 'bg-primary/20'
                      : stat.color === 'success'
                        ? 'bg-success/20'
                        : stat.color === 'accent'
                          ? 'bg-accent/20'
                          : 'bg-warning/20'
                  }`}
                >
                  <stat.icon
                    className={`w-4 h-4 ${
                      stat.color === 'primary'
                        ? 'text-primary'
                        : stat.color === 'success'
                          ? 'text-success'
                          : stat.color === 'accent'
                            ? 'text-accent'
                            : 'text-warning'
                    }`}
                  />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg gap-2">
          <MessageSquare className="w-4 h-4" />
          Ask AI 🤖
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2"
        >
          <Calendar className="w-4 h-4" />
          Schedule
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2"
        >
          <Award className="w-4 h-4" />
          Achievements
        </Button>
      </div>
    </motion.div>
  );
}
