'use client';

import { motion } from 'framer-motion';
import { Download, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const attendanceData = [
  { name: 'Week 1', attendance: 92 },
  { name: 'Week 2', attendance: 94 },
  { name: 'Week 3', attendance: 89 },
  { name: 'Week 4', attendance: 96 },
];

const quizData = [
  { name: 'Quiz 1', score: 75 },
  { name: 'Quiz 2', score: 82 },
  { name: 'Quiz 3', score: 78 },
  { name: 'Quiz 4', score: 88 },
  { name: 'Quiz 5', score: 85 },
];

const engagementData = [
  { name: 'High', value: 60, fill: '#10b981' },
  { name: 'Medium', value: 25, fill: '#f59e0b' },
  { name: 'Low', value: 15, fill: '#ef4444' },
];

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="teacher" />

      <div className="flex-1 flex flex-col">
        <Header title="Analytics & Reports" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header with Export */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-between items-center"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Class Performance Analytics</h2>
                <p className="text-muted-foreground">Comprehensive insights into student progress</p>
              </div>
              <Button className="flex items-center gap-2" asChild>
                <a href="#">
                  <Download className="w-4 h-4" />
                  Export PDF
                </a>
              </Button>
            </motion.div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Trend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="p-6 border-border/50">
                  <h3 className="text-lg font-semibold mb-4">Attendance Trend</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                        <YAxis stroke="var(--muted-foreground)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="attendance"
                          stroke="var(--accent)"
                          strokeWidth={2}
                          dot={{ fill: 'var(--accent)', r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </motion.div>

              {/* Quiz Performance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="p-6 border-border/50">
                  <h3 className="text-lg font-semibold mb-4">Quiz Performance</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={quizData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                        <YAxis stroke="var(--muted-foreground)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="score" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </motion.div>

              {/* Student Engagement */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="p-6 border-border/50">
                  <h3 className="text-lg font-semibold mb-4">Student Engagement</h3>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={engagementData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {engagementData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {engagementData.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="text-sm">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* AI Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Card className="p-6 border-border/50 flex flex-col">
                  <h3 className="text-lg font-semibold mb-4">AI Suggestions</h3>
                  <div className="space-y-3 flex-1">
                    {[
                      'Focus on hands-on practice for algebra topics',
                      'Group 3 students need additional support in geometry',
                      'Consider peer tutoring program with high performers',
                      'Schedule remedial sessions for top 3 at-risk students',
                    ].map((suggestion, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-accent/10 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Daily Reports */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Card className="p-6 border-border/50">
                <h3 className="text-lg font-semibold mb-4">Recent Daily Reports</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition cursor-pointer">
                      <div>
                        <p className="font-medium">Daily Report - {i < 3 ? 'Dec ' + (12 - i) : 'Dec 9'}</p>
                        <p className="text-sm text-muted-foreground">45 students • 3 classes</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
