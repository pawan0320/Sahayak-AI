'use client';

import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertCircle, BookOpen, ArrowRight, Activity,MessageSquare, Plus, BarChart3, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DashboardWidget, StatItem, QuickActionButton } from '@/components/dashboard/DashboardWidgets';
import { SimpleBarChart, SimpleLineChart } from '@/components/charts/SimpleCharts';
import { useAuth } from '@/components/auth/AuthContext';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const performanceData = [
  { name: 'Mon', performance: 75, attendance: 92, trend: 72 },
  { name: 'Tue', performance: 82, attendance: 94, trend: 78 },
  { name: 'Wed', performance: 79, attendance: 89, trend: 80 },
  { name: 'Thu', performance: 88, attendance: 96, trend: 85 },
  { name: 'Fri', performance: 85, attendance: 93, trend: 88 },
  { name: 'Sat', performance: 90, attendance: 97, trend: 92 },
];

const studentPerformanceData = [
  { label: 'Aman Singh', value: 85 },
  { label: 'Priya Sharma', value: 92 },
  { label: 'Raj Kumar', value: 78 },
  { label: 'Neha Patel', value: 88 },
  { label: 'Vikram Singh', value: 95 },
];

const attendanceData = [
  { label: 'Week 1', value: 92 },
  { label: 'Week 2', value: 94 },
  { label: 'Week 3', value: 89 },
  { label: 'Week 4', value: 96 },
];

const atRiskStudents = [
  { id: 1, name: 'Aman Singh', rollNumber: '101', attendance: '65%', avgScore: '45%', status: 'high-risk' },
  { id: 2, name: 'Priya Sharma', rollNumber: '105', attendance: '72%', avgScore: '52%', status: 'moderate-risk' },
  { id: 3, name: 'Raj Kumar', rollNumber: '112', attendance: '58%', avgScore: '38%', status: 'high-risk' },
];

export default function TeacherDashboard() {
  // Auth context is accessed via layout/header components
  
  const widgets = [
    {
      title: 'Total Students',
      value: '45',
      icon: <Users className="w-6 h-6" />,
      trend: { value: 2, direction: 'up' as const },
      color: 'primary' as const,
      delay: 0.1,
    },
    {
      title: 'Average Attendance',
      value: '92%',
      icon: <Activity className="w-6 h-6" />,
      trend: { value: 5, direction: 'up' as const },
      color: 'accent' as const,
      delay: 0.2,
    },
    {
      title: 'Avg Quiz Score',
      value: '78%',
      icon: <TrendingUp className="w-6 h-6" />,
      trend: { value: 3, direction: 'up' as const },
      color: 'success' as const,
      delay: 0.3,
    },
    {
      title: 'At-Risk Students',
      value: '3',
      icon: <AlertCircle className="w-6 h-6" />,
      trend: { value: 1, direction: 'down' as const },
      color: 'warning' as const,
      delay: 0.4,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1">
          <Header title="Dashboard" showMenu={true} />

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                Welcome back, Teacher!
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your class today
              </p>
            </motion.div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {widgets.map((widget, index) => (
                <DashboardWidget
                  key={index}
                  title={widget.title}
                  value={widget.value}
                  icon={widget.icon}
                  trend={widget.trend}
                  color={widget.color}
                  delay={widget.delay}
                />
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Student Performance Chart */}
              <SimpleBarChart
                title="Student Performance"
                data={studentPerformanceData.map((d) => ({
                  label: d.label.split(' ')[0],
                  value: d.value,
                }))}
                delay={0.5}
              />

              {/* Attendance Trend */}
              <SimpleLineChart
                title="Weekly Attendance Trend"
                data={attendanceData}
                delay={0.6}
              />
            </div>

            {/* Performance Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mb-8"
            >
              <Card className="p-6 bg-gradient-to-br from-background to-secondary/20 border-border/50">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Weekly Performance Trends
                </h3>
                <div className="space-y-4">
                  {performanceData.map((data, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.65 + index * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{data.name}</span>
                        <span className="text-sm font-bold text-primary">{data.trend}%</span>
                      </div>
                      <div className="w-full bg-secondary/40 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${data.trend}%` }}
                          transition={{ duration: 0.8, delay: 0.65 + index * 0.05 }}
                          className="bg-gradient-to-r from-primary to-accent rounded-full h-2"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* At-Risk Students & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* At-Risk Students Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.75 }}
                className="lg:col-span-2"
              >
                <Card className="p-6 bg-gradient-to-br from-background to-secondary/20 border-border/50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-warning" />
                      At-Risk Students
                    </h3>
                    <Link href="/analytics">
                      <Button variant="ghost" size="sm" className="gap-2">
                        View All <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {atRiskStudents.map((student, index) => (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.75 + index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-all group cursor-pointer"
                      >
                        <div className="flex-1">
                          <p className="font-medium mb-1">{student.name}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Roll: {student.rollNumber}</span>
                            <span>Attendance: {student.attendance}</span>
                            <span>Avg: {student.avgScore}</span>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            student.status === 'high-risk'
                              ? 'bg-destructive/20 text-destructive'
                              : 'bg-warning/20 text-warning'
                          }`}
                        >
                          {student.status === 'high-risk' ? 'High Risk' : 'Moderate'}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.85 }}
              >
                <Card className="p-6 h-full bg-gradient-to-br from-background to-secondary/20 border-border/50">
                  <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>

                  <div className="space-y-3">
                    <Link href="/lessons">
                      <QuickActionButton
                        label="Create Lesson"
                        icon={<Plus className="w-4 h-4" />}
                        color="primary"
                      />
                    </Link>

                    <Link href="/groups">
                      <QuickActionButton
                        label="Create Groups"
                        icon={<Users className="w-4 h-4" />}
                        color="accent"
                      />
                    </Link>

                    <Link href="/schedule">
                      <QuickActionButton
                        label="View Schedule"
                        icon={<Calendar className="w-4 h-4" />}
                        color="success"
                      />
                    </Link>

                    <Link href="/analytics">
                      <QuickActionButton
                        label="Analytics"
                        icon={<BarChart3 className="w-4 h-4" />}
                        color="warning"
                      />
                    </Link>

                    <Link href="/assistant">
                      <QuickActionButton
                        label="Ask AI Assistant"
                        icon={<MessageSquare className="w-4 h-4" />}
                      />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.95 }}
            >
              <Card className="p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">AI Insights</h3>
                    <p className="text-muted-foreground mb-4">
                      Based on this week's performance data: 92% attendance, 78% average quiz scores. 
                      Focus on topics where 3 students struggled. Consider optional sessions for at-risk students.
                    </p>
                    <div className="flex gap-2">
                      <Button>Explore Suggestions</Button>
                      <Button variant="outline">Dismiss</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
