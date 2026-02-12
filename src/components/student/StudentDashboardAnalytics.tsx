'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Calendar, BookOpen, CheckCircle, AlertCircle, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface QuizAttempt {
  date: string;
  score: number;
  total: number;
  topic: string;
}

interface AttendanceRecord {
  date: string;
  present: boolean;
  reasonIfAbsent?: string;
}

interface StudentAnalyticsProps {
  studentGrade: string;
  quizHistory: QuizAttempt[];
  attendance: AttendanceRecord[];
}

export function StudentDashboardAnalytics({
  studentGrade,
  quizHistory = [],
  attendance = [],
}: StudentAnalyticsProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [quizStats, setQuizStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    improvementRate: 0,
  });

  useEffect(() => {
    // Mock quiz history
    const mockQuizzes: QuizAttempt[] = [
      { date: 'Jan 1', score: 7.5, total: 10, topic: 'Fractions' },
      { date: 'Jan 5', score: 8, total: 10, topic: 'Decimals' },
      { date: 'Jan 10', score: 7, total: 10, topic: 'Percentages' },
      { date: 'Jan 15', score: 8.5, total: 10, topic: 'Ratios' },
      { date: 'Jan 20', score: 9, total: 10, topic: 'Algebra' },
    ];

    setChartData(mockQuizzes);

    // Calculate stats
    if (mockQuizzes.length > 0) {
      const scores = mockQuizzes.map((q) => (q.score / q.total) * 100);
      const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const bestScore = Math.max(...scores);
      const improvementRate =
        scores.length > 1
          ? Math.round(((scores[scores.length - 1] - scores[0]) / scores[0]) * 100)
          : 0;

      setQuizStats({
        totalAttempts: mockQuizzes.length,
        averageScore: avgScore,
        bestScore: Math.round(bestScore),
        improvementRate,
      });
    }

    // Mock attendance
    const mockAttendance: AttendanceRecord[] = Array.from({ length: 20 }, (_, i) => ({
      date: `Day ${i + 1}`,
      present: Math.random() > 0.1,
      reasonIfAbsent: Math.random() > 0.1 ? undefined : 'Sick',
    }));

    const attendancePercentage = (mockAttendance.filter((a) => a.present).length / mockAttendance.length) * 100;
    setAttendanceData([
      { name: 'Present', value: Math.round(attendancePercentage) },
      { name: 'Absent', value: Math.round(100 - attendancePercentage) },
    ]);
  }, [quizHistory, attendance]);

  const attendancePercentage = Math.round(
    (attendanceData.find((d) => d.name === 'Present')?.value || 0)
  );

  const colors = ['#10b981', '#ef4444'];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            icon: CheckCircle,
            label: 'Quizzes',
            value: quizStats.totalAttempts,
            color: 'primary',
          },
          {
            icon: TrendingUp,
            label: 'Avg Score',
            value: `${quizStats.averageScore}%`,
            color: 'accent',
          },
          {
            icon: Award,
            label: 'Best Score',
            value: `${quizStats.bestScore}%`,
            color: 'success',
          },
          {
            icon: AlertCircle,
            label: 'Improvement',
            value: `${quizStats.improvementRate > 0 ? '+' : ''}${quizStats.improvementRate}%`,
            color: quizStats.improvementRate > 0 ? 'success' : 'warning',
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border border-border/50 bg-gradient-to-br from-${stat.color}/5 to-transparent`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2 rounded-lg bg-${stat.color}/20`}
              >
                <stat.icon className={`w-4 h-4 text-${stat.color}`} />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quiz Performance Chart */}
        <motion.div
          className="lg:col-span-2 p-4 rounded-lg border border-border/50 bg-gradient-to-br from-background to-secondary/5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="w-5 h-5 text-primary" />
            <h3 className="font-bold">📊 Quiz Performance Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="date" stroke="rgba(0,0,0,0.5)" />
              <YAxis stroke="rgba(0,0,0,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: 'none',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 text-xs text-muted-foreground">
            📈 Your score has {quizStats.improvementRate > 0 ? 'improved' : 'fluctuated'}{' '}
            {Math.abs(quizStats.improvementRate)}% over these quizzes
          </div>
        </motion.div>

        {/* Attendance Pie Chart */}
        <motion.div
          className="p-4 rounded-lg border border-border/50 bg-gradient-to-br from-background to-secondary/5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-accent" />
            <h3 className="font-bold">📅 Attendance</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                isAnimationActive
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 text-center">
            <p className="text-2xl font-bold text-success">{attendancePercentage}%</p>
            <p className="text-xs text-muted-foreground">Attendance Rate</p>
          </div>
        </motion.div>
      </div>

      {/* Subject Performance */}
      <motion.div
        className="p-4 rounded-lg border border-border/50 bg-gradient-to-br from-background to-secondary/5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          <h3 className="font-bold">📚 Subject-wise Performance</h3>
        </div>

        <div className="space-y-3">
          {[
            { subject: 'Mathematics', score: 8.5, icon: '🔢' },
            { subject: 'Science', score: 8, icon: '🔬' },
            { subject: 'English', score: 7.5, icon: '📖' },
            { subject: 'History', score: 9, icon: '📜' },
            { subject: 'Geography', score: 7.8, icon: '🗺️' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="text-lg">{item.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold">{item.subject}</span>
                  <span className="text-xs font-bold text-primary">{item.score}/10</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary/50 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.score / 10) * 100}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div
        className="p-4 rounded-lg border border-accent/30 bg-accent/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-bold mb-3 flex items-center gap-2">
          💡 AI Insights
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>
              Great improvement in Mathematics! Keep practicing problem-solving.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>
              Your attendance is excellent (95%). Keep up the consistency!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span>⚠</span>
            <span>
              Consider focusing more on Science. You scored 8%, which can be improved.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>
              Great performance in History! You're understanding concepts well.
            </span>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
