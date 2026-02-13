'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Target,
  Download,
  Filter,
  Calendar,
  BarChart3,
} from 'lucide-react';

interface StudentPerformance {
  id: string;
  name: string;
  attendance: number;
  quizScore: number;
  engagement: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'average' | 'at-risk';
}

interface AISuggestion {
  id: string;
  type: 'teaching' | 'support';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  students?: string[];
}

const studentData: StudentPerformance[] = [
  {
    id: 's1',
    name: 'Anika Singh',
    attendance: 95,
    quizScore: 88,
    engagement: 92,
    trend: 'up',
    status: 'excellent',
  },
  {
    id: 's2',
    name: 'Rohit Mishra',
    attendance: 88,
    quizScore: 76,
    engagement: 82,
    trend: 'stable',
    status: 'good',
  },
  {
    id: 's3',
    name: 'Meera Das',
    attendance: 72,
    quizScore: 65,
    engagement: 58,
    trend: 'down',
    status: 'at-risk',
  },
  {
    id: 's4',
    name: 'Vikram Patel',
    attendance: 91,
    quizScore: 84,
    engagement: 88,
    trend: 'up',
    status: 'excellent',
  },
  {
    id: 's5',
    name: 'Neha Sharma',
    attendance: 85,
    quizScore: 72,
    engagement: 75,
    trend: 'stable',
    status: 'average',
  },
  {
    id: 's6',
    name: 'Arjun Kumar',
    attendance: 68,
    quizScore: 58,
    engagement: 52,
    trend: 'down',
    status: 'at-risk',
  },
];

const attendanceData = [
  { week: 'Week 1', present: 42, absent: 3 },
  { week: 'Week 2', present: 40, absent: 5 },
  { week: 'Week 3', present: 43, absent: 2 },
  { week: 'Week 4', present: 41, absent: 4 },
  { week: 'Week 5', present: 44, absent: 1 },
];

const quizData = [
  { quiz: 'Q1', avg: 72, highScore: 95, lowScore: 45 },
  { quiz: 'Q2', avg: 75, highScore: 96, lowScore: 48 },
  { quiz: 'Q3', avg: 78, highScore: 98, lowScore: 52 },
  { quiz: 'Q4', avg: 76, highScore: 95, lowScore: 50 },
];

const engagementData = [
  { day: 'Mon', engagement: 78 },
  { day: 'Tue', engagement: 82 },
  { day: 'Wed', engagement: 75 },
  { day: 'Thu', engagement: 85 },
  { day: 'Fri', engagement: 88 },
];

const suggestions: AISuggestion[] = [
  {
    id: 'teach1',
    type: 'teaching',
    title: 'Interactive Problem-Solving Sessions',
    description:
      'Introduce peer-led group activities during lessons to improve engagement. Based on analysis, interactive sessions boost engagement by 15-20%.',
    impact: 'high',
  },
  {
    id: 'teach2',
    type: 'teaching',
    title: 'Visual Learning Materials',
    description:
      'Incorporate more video demonstrations and animated diagrams. Students with visual learning preference show 25% better retention.',
    impact: 'high',
  },
  {
    id: 'teach3',
    type: 'teaching',
    title: 'Real-World Applications',
    description:
      'Connect mathematical concepts to practical scenarios. This improves understanding and keeps students engaged.',
    impact: 'medium',
  },
  {
    id: 'support1',
    type: 'support',
    title: 'Intensive Support for At-Risk Students',
    description:
      'Meera Das & Arjun Kumar need extra attention. Consider 1-on-1 sessions or peer tutoring programs.',
    impact: 'high',
    students: ['Meera Das', 'Arjun Kumar'],
  },
  {
    id: 'support2',
    type: 'support',
    title: 'Attendance Intervention',
    description:
      'Focus on improving attendance for students below 80%. Regular attendance correlates with 30% better quiz scores.',
    impact: 'high',
    students: ['Meera Das', 'Arjun Kumar', 'Neha Sharma'],
  },
  {
    id: 'support3',
    type: 'support',
    title: 'Enrichment for Top Performers',
    description:
      'Challenge high-performing students with advanced problems to maintain motivation and deeper learning.',
    impact: 'medium',
    students: ['Anika Singh', 'Vikram Patel'],
  },
];

export default function TeacherAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const atRiskStudents = studentData.filter((s) => s.status === 'at-risk');
  const excellentStudents = studentData.filter((s) => s.status === 'excellent');
  const avgAttendance = Math.round(
    studentData.reduce((sum, s) => sum + s.attendance, 0) / studentData.length
  );
  const avgEngagement = Math.round(
    studentData.reduce((sum, s) => sum + s.engagement, 0) / studentData.length
  );
  const avgQuizScore = Math.round(
    studentData.reduce((sum, s) => sum + s.quizScore, 0) / studentData.length
  );

  const performanceDistribution = [
    { name: 'Excellent', value: excellentStudents.length, fill: '#10b981' },
    {
      name: 'Good',
      value: studentData.filter((s) => s.status === 'good').length,
      fill: '#3b82f6',
    },
    {
      name: 'Average',
      value: studentData.filter((s) => s.status === 'average').length,
      fill: '#f59e0b',
    },
    { name: 'At-Risk', value: atRiskStudents.length, fill: '#ef4444' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500/20 text-green-400';
      case 'good':
        return 'bg-blue-500/20 text-blue-400';
      case 'average':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'at-risk':
        return 'bg-red-500/20 text-red-400';
      default:
        return '';
    }
  };

  const getImpactColor = (impact: string) => {
    return impact === 'high'
      ? 'border-red-500/50 bg-red-500/10'
      : impact === 'medium'
        ? 'border-yellow-500/50 bg-yellow-500/10'
        : 'border-blue-500/50 bg-blue-500/10';
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8'
      >
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg'>
              <BarChart3 className='w-6 h-6 text-white' />
            </div>
            <div>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                Student Performance Analytics
              </h1>
              <p className='text-slate-400'>Class 5-A • Mathematics</p>
            </div>
          </div>
          <div className='flex gap-2'>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className='px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50'
            >
              <option value='week'>This Week</option>
              <option value='month'>This Month</option>
              <option value='semester'>This Semester</option>
            </select>
            <Button className='bg-purple-600 hover:bg-purple-700'>
              <Download className='w-4 h-4 mr-2' />
              Export Report
            </Button>
          </div>
        </div>
      </motion.div>

      {/* At-Risk Alert */}
      {atRiskStudents.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='mb-8'
        >
          <Alert className='border-red-500/50 bg-red-500/10'>
            <AlertTriangle className='w-4 h-4 text-red-500' />
            <AlertDescription className='text-red-400'>
              {atRiskStudents.length} student(s) need immediate attention. Attendance and engagement
              are declining.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'
      >
        {[
          {
            icon: Users,
            label: 'Total Students',
            value: studentData.length,
            subtext: `${excellentStudents.length} excellent performers`,
            color: 'from-blue-600 to-blue-400',
          },
          {
            icon: Target,
            label: 'Avg Attendance',
            value: `${avgAttendance}%`,
            subtext: 'Last 5 weeks',
            color: 'from-green-600 to-green-400',
          },
          {
            icon: BookOpen,
            label: 'Avg Quiz Score',
            value: `${avgQuizScore}%`,
            subtext: '4 quizzes completed',
            color: 'from-purple-600 to-purple-400',
          },
          {
            icon: TrendingUp,
            label: 'Avg Engagement',
            value: `${avgEngagement}%`,
            subtext: 'AI-tracked sessions',
            color: 'from-pink-600 to-pink-400',
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Card className='p-4 border-slate-700/50 bg-slate-900/50 hover:border-slate-600 transition'>
              <div className={`inline-block p-2 bg-gradient-to-br ${stat.color} rounded-lg mb-3`}>
                <stat.icon className='w-5 h-5 text-white' />
              </div>
              <p className='text-slate-400 text-xs mb-1'>{stat.label}</p>
              <p className='text-2xl font-bold text-white'>{stat.value}</p>
              <p className='text-xs text-slate-500 mt-1'>{stat.subtext}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-5 bg-slate-900/50 border border-slate-700/50'>
            <TabsTrigger value='overview' className='data-[state=active]:bg-purple-500/20'>
              Overview
            </TabsTrigger>
            <TabsTrigger value='attendance' className='data-[state=active]:bg-purple-500/20'>
              Attendance
            </TabsTrigger>
            <TabsTrigger value='quizzes' className='data-[state=active]:bg-purple-500/20'>
              Quizzes
            </TabsTrigger>
            <TabsTrigger value='engagement' className='data-[state=active]:bg-purple-500/20'>
              Engagement
            </TabsTrigger>
            <TabsTrigger value='suggestions' className='data-[state=active]:bg-purple-500/20'>
              AI Suggestions
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value='overview' className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Performance Distribution */}
              <Card className='p-6 border-slate-700/50 bg-slate-900/50'>
                <h3 className='text-lg font-semibold mb-4 text-white'>Performance Distribution</h3>
                <div className='h-80 flex items-center justify-center'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={performanceDistribution}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={120}
                        fill='#8884d8'
                        dataKey='value'
                      >
                        {performanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Student Performance Table */}
              <Card className='p-6 border-slate-700/50 bg-slate-900/50'>
                <h3 className='text-lg font-semibold mb-4 text-white'>Student Performance</h3>
                <div className='space-y-2 max-h-80 overflow-y-auto'>
                  {studentData.map((student) => (
                    <div
                      key={student.id}
                      className='p-3 bg-slate-800/50 rounded-lg flex items-center justify-between hover:bg-slate-700/50 transition'
                    >
                      <div className='flex-1'>
                        <p className='text-sm font-medium text-white'>{student.name}</p>
                        <div className='flex gap-4 mt-1'>
                          <span className='text-xs text-slate-400'>
                            Att: <span className='text-slate-300'>{student.attendance}%</span>
                          </span>
                          <span className='text-xs text-slate-400'>
                            Quiz: <span className='text-slate-300'>{student.quizScore}%</span>
                          </span>
                          <span className='text-xs text-slate-400'>
                            Eng: <span className='text-slate-300'>{student.engagement}%</span>
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(student.status)}`}>
                          {student.status}
                        </span>
                        {student.trend === 'up' && (
                          <TrendingUp className='w-4 h-4 text-green-400' />
                        )}
                        {student.trend === 'down' && (
                          <TrendingDown className='w-4 h-4 text-red-400' />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value='attendance' className='space-y-6'>
            <Card className='p-6 border-slate-700/50 bg-slate-900/50'>
              <h3 className='text-lg font-semibold mb-4 text-white'>Weekly Attendance Trend</h3>
              <div className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
                    <XAxis dataKey='week' stroke='#94a3b8' />
                    <YAxis stroke='#94a3b8' />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey='present' stackId='a' fill='#10b981' />
                    <Bar dataKey='absent' stackId='a' fill='#ef4444' />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value='quizzes' className='space-y-6'>
            <Card className='p-6 border-slate-700/50 bg-slate-900/50'>
              <h3 className='text-lg font-semibold mb-4 text-white'>Quiz Performance Trends</h3>
              <div className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={quizData}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
                    <XAxis dataKey='quiz' stroke='#94a3b8' />
                    <YAxis stroke='#94a3b8' />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type='monotone'
                      dataKey='avg'
                      stroke='#8b5cf6'
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6' }}
                      name='Average'
                    />
                    <Line
                      type='monotone'
                      dataKey='highScore'
                      stroke='#10b981'
                      strokeWidth={2}
                      dot={{ fill: '#10b981' }}
                      name='Highest'
                    />
                    <Line
                      type='monotone'
                      dataKey='lowScore'
                      stroke='#ef4444'
                      strokeWidth={2}
                      dot={{ fill: '#ef4444' }}
                      name='Lowest'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value='engagement' className='space-y-6'>
            <Card className='p-6 border-slate-700/50 bg-slate-900/50'>
              <h3 className='text-lg font-semibold mb-4 text-white'>Daily Engagement Metrics</h3>
              <div className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={engagementData}>
                    <defs>
                      <linearGradient id='colorEngagement' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#ec4899' stopOpacity={0.8} />
                        <stop offset='95%' stopColor='#ec4899' stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
                    <XAxis dataKey='day' stroke='#94a3b8' />
                    <YAxis stroke='#94a3b8' />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type='monotone'
                      dataKey='engagement'
                      stroke='#ec4899'
                      fillOpacity={1}
                      fill='url(#colorEngagement)'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          {/* AI Suggestions Tab */}
          <TabsContent value='suggestions' className='space-y-4'>
            {/* Teaching Improvements */}
            <div>
              <h3 className='text-lg font-semibold mb-4 text-white flex items-center gap-2'>
                <Lightbulb className='w-5 h-5 text-yellow-400' />
                Teaching Improvements
              </h3>
              <div className='space-y-3'>
                {suggestions
                  .filter((s) => s.type === 'teaching')
                  .map((suggestion) => (
                    <Card
                      key={suggestion.id}
                      className={`p-4 border ${getImpactColor(suggestion.impact)}`}
                    >
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <h4 className='font-semibold text-white mb-1'>{suggestion.title}</h4>
                          <p className='text-sm text-slate-300'>{suggestion.description}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${
                            suggestion.impact === 'high'
                              ? 'bg-red-500/20 text-red-400'
                              : suggestion.impact === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {suggestion.impact} impact
                        </span>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>

            {/* Student Support Recommendations */}
            <div className='mt-8'>
              <h3 className='text-lg font-semibold mb-4 text-white flex items-center gap-2'>
                <AlertTriangle className='w-5 h-5 text-red-400' />
                Student Support Recommendations
              </h3>
              <div className='space-y-3'>
                {suggestions
                  .filter((s) => s.type === 'support')
                  .map((suggestion) => (
                    <Card
                      key={suggestion.id}
                      className={`p-4 border ${getImpactColor(suggestion.impact)}`}
                    >
                      <div>
                        <h4 className='font-semibold text-white mb-2 flex items-center justify-between'>
                          {suggestion.title}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              suggestion.impact === 'high'
                                ? 'bg-red-500/20 text-red-400'
                                : suggestion.impact === 'medium'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {suggestion.impact} impact
                          </span>
                        </h4>
                        <p className='text-sm text-slate-300 mb-3'>{suggestion.description}</p>
                        {suggestion.students && (
                          <div className='flex flex-wrap gap-2'>
                            {suggestion.students.map((student) => (
                              <span
                                key={student}
                                className='text-xs px-2 py-1 bg-slate-700/50 text-slate-300 rounded-full'
                              >
                                {student}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Footer */}
      <div className='mt-8 text-center text-slate-500 text-sm'>
        Data updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}
