'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Building2,
  Users,
  GraduationCap,
  Activity,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  AlertCircle,
  BarChart3,
} from 'lucide-react';

interface School {
  id: string;
  name: string;
  location: string;
  teacherCount: number;
  studentCount: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  school: string;
  subject: string;
  studentCount: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

interface Student {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  school: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
}

interface AISession {
  id: string;
  teacher: string;
  class: string;
  students: number;
  duration: number;
  engagement: number;
  timestamp: string;
}

interface PendingApproval {
  id: string;
  name: string;
  type: 'teacher' | 'student' | 'school';
  email?: string;
  appliedAt: string;
}

const mockSchools: School[] = [
  {
    id: '1',
    name: 'Govt. Primary School, Panchkot',
    location: 'Purulia, WB',
    teacherCount: 12,
    studentCount: 285,
    status: 'active',
    createdAt: '2025-06-15',
  },
  {
    id: '2',
    name: 'St. Mary Secondary School',
    location: 'Kolkata, WB',
    teacherCount: 28,
    studentCount: 650,
    status: 'active',
    createdAt: '2025-07-20',
  },
  {
    id: '3',
    name: 'New Hope School',
    location: 'Chhattisgarh',
    teacherCount: 8,
    studentCount: 180,
    status: 'pending',
    createdAt: '2026-02-10',
  },
];

const mockTeachers: Teacher[] = [
  {
    id: 't1',
    name: 'Rajesh Kumar',
    email: 'rajesh@sahayak.com',
    school: 'Govt. Primary School, Panchkot',
    subject: 'Mathematics',
    studentCount: 45,
    status: 'active',
    createdAt: '2025-06-20',
  },
  {
    id: 't2',
    name: 'Priya Sharma',
    email: 'priya@sahayak.com',
    school: 'St. Mary Secondary School',
    subject: 'English',
    studentCount: 62,
    status: 'active',
    createdAt: '2025-08-15',
  },
  {
    id: 't3',
    name: 'Vikram Patel',
    email: 'vikram@sahayak.com',
    school: 'Govt. Primary School, Panchkot',
    subject: 'Science',
    studentCount: 40,
    status: 'pending',
    createdAt: '2026-02-09',
  },
];

const mockStudents: Student[] = [
  {
    id: 's1',
    name: 'Anika Singh',
    rollNo: '001',
    class: '5-A',
    school: 'Govt. Primary School, Panchkot',
    status: 'active',
    lastActive: '2026-02-12 14:30',
  },
  {
    id: 's2',
    name: 'Rohit Mishra',
    rollNo: '002',
    class: '5-A',
    school: 'Govt. Primary School, Panchkot',
    status: 'active',
    lastActive: '2026-02-12 13:15',
  },
  {
    id: 's3',
    name: 'Meera Das',
    rollNo: 'P001',
    class: '6-B',
    school: 'St. Mary Secondary School',
    status: 'pending',
    lastActive: '2026-02-11 10:00',
  },
];

const mockAISessions: AISession[] = [
  {
    id: 'ai1',
    teacher: 'Rajesh Kumar',
    class: '5-A',
    students: 42,
    duration: 45,
    engagement: 87,
    timestamp: '2026-02-12 09:30',
  },
  {
    id: 'ai2',
    teacher: 'Priya Sharma',
    class: '6-C',
    students: 55,
    duration: 50,
    engagement: 92,
    timestamp: '2026-02-12 10:15',
  },
  {
    id: 'ai3',
    teacher: 'Rajesh Kumar',
    class: '5-B',
    students: 38,
    duration: 40,
    engagement: 78,
    timestamp: '2026-02-12 11:00',
  },
];

const mockPendingApprovals: PendingApproval[] = [
  {
    id: 'p1',
    name: 'Vikram Patel',
    type: 'teacher',
    email: 'vikram@sahayak.com',
    appliedAt: '2026-02-09',
  },
  {
    id: 'p2',
    name: 'New Hope School',
    type: 'school',
    appliedAt: '2026-02-10',
  },
  {
    id: 'p3',
    name: 'Meera Das',
    type: 'student',
    appliedAt: '2026-02-11',
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [schools, setSchools] = useState<School[]>(mockSchools);
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [aiSessions, setAISessions] = useState<AISession[]>(mockAISessions);
  const [pendingApprovals, setPendingApprovals] =
    useState<PendingApproval[]>(mockPendingApprovals);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const stats = {
    totalSchools: schools.length,
    activeSchools: schools.filter((s) => s.status === 'active').length,
    totalTeachers: teachers.length,
    activeTeachers: teachers.filter((t) => t.status === 'active').length,
    totalStudents: students.length,
    activeStudents: students.filter((s) => s.status === 'active').length,
    aiSessions: aiSessions.length,
    averageEngagement: Math.round(
      aiSessions.reduce((sum, s) => sum + s.engagement, 0) / aiSessions.length
    ),
    pendingApprovals: pendingApprovals.length,
  };

  const handleApprove = (id: string) => {
    setPendingApprovals(pendingApprovals.filter((p) => p.id !== id));
  };

  const handleReject = (id: string) => {
    setPendingApprovals(pendingApprovals.filter((p) => p.id !== id));
  };

  const handleDeleteSchool = (id: string) => {
    setSchools(schools.filter((s) => s.id !== id));
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers(teachers.filter((t) => t.id !== id));
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const filteredSchools =
    filterStatus === 'all'
      ? schools
      : schools.filter((s) => s.status === filterStatus);

  const filteredTeachers =
    filterStatus === 'all'
      ? teachers
      : teachers.filter((t) => t.status === filterStatus);

  const filteredStudents =
    filterStatus === 'all'
      ? students
      : students.filter((s) => s.status === filterStatus);

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-500/20 text-green-400'
      : status === 'pending'
        ? 'bg-yellow-500/20 text-yellow-400'
        : 'bg-red-500/20 text-red-400';
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8'
      >
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg'>
            <BarChart3 className='w-6 h-6 text-white' />
          </div>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>
            Admin Control Panel
          </h1>
        </div>
        <p className='text-slate-400'>Manage schools, teachers, students & AI sessions</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'
      >
        {[
          {
            icon: Building2,
            label: 'Schools',
            value: stats.activeSchools,
            total: stats.totalSchools,
            color: 'from-blue-600 to-blue-400',
          },
          {
            icon: Users,
            label: 'Teachers',
            value: stats.activeTeachers,
            total: stats.totalTeachers,
            color: 'from-purple-600 to-purple-400',
          },
          {
            icon: GraduationCap,
            label: 'Students',
            value: stats.activeStudents,
            total: stats.totalStudents,
            color: 'from-green-600 to-green-400',
          },
          {
            icon: Activity,
            label: 'AI Sessions',
            value: stats.aiSessions,
            total: stats.averageEngagement,
            color: 'from-orange-600 to-orange-400',
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Card className='p-6 border-slate-700/50 bg-slate-900/50 hover:border-slate-600 transition'>
              <div className={`inline-block p-3 bg-gradient-to-br ${stat.color} rounded-lg mb-4`}>
                <stat.icon className='w-6 h-6 text-white' />
              </div>
              <p className='text-slate-400 text-sm mb-1'>{stat.label}</p>
              <div className='flex items-baseline gap-2'>
                <span className='text-2xl font-bold text-white'>{stat.value}</span>
                <span className='text-xs text-slate-500'>of {stat.total}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Pending Approvals Alert */}
      {stats.pendingApprovals > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='mb-8'
        >
          <Alert className='border-yellow-500/50 bg-yellow-500/10'>
            <AlertCircle className='w-4 h-4 text-yellow-500' />
            <AlertDescription className='text-yellow-400'>
              {stats.pendingApprovals} pending approvals require your attention
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-5 bg-slate-900/50 border border-slate-700/50'>
            <TabsTrigger value='overview' className='data-[state=active]:bg-blue-500/20'>
              Overview
            </TabsTrigger>
            <TabsTrigger value='schools' className='data-[state=active]:bg-blue-500/20'>
              Schools
            </TabsTrigger>
            <TabsTrigger value='teachers' className='data-[state=active]:bg-blue-500/20'>
              Teachers
            </TabsTrigger>
            <TabsTrigger value='students' className='data-[state=active]:bg-blue-500/20'>
              Students
            </TabsTrigger>
            <TabsTrigger value='approvals' className='data-[state=active]:bg-blue-500/20'>
              Approvals
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value='overview' className='space-y-6'>
            <Card className='p-6 border-slate-700/50 bg-slate-900/50'>
              <h3 className='text-lg font-semibold mb-4 text-white flex items-center gap-2'>
                <Activity className='w-5 h-5 text-orange-400' />
                Recent AI Sessions
              </h3>
              <div className='space-y-3'>
                {aiSessions.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    className='flex items-center justify-between p-3 bg-slate-800/50 rounded-lg'
                  >
                    <div>
                      <p className='text-sm font-medium text-white'>{session.teacher}</p>
                      <p className='text-xs text-slate-400'>
                        {session.class} • {session.students} students
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-xs text-slate-400'>{session.timestamp}</p>
                      <div className='flex items-center gap-2 mt-1'>
                        <TrendingUp className='w-4 h-4 text-green-400' />
                        <span className='text-sm font-medium text-green-400'>
                          {session.engagement}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Schools Tab */}
          <TabsContent value='schools' className='space-y-4'>
            <div className='flex gap-3 mb-4'>
              <div className='flex-1 relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500' />
                <input
                  type='text'
                  placeholder='Search schools...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className='px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50'
              >
                <option value='all'>All Status</option>
                <option value='active'>Active</option>
                <option value='pending'>Pending</option>
                <option value='inactive'>Inactive</option>
              </select>
              <Button className='bg-blue-600 hover:bg-blue-700'>
                <Plus className='w-4 h-4 mr-2' />
                Add School
              </Button>
            </div>

            <div className='space-y-2'>
              {filteredSchools.map((school) => (
                <Card
                  key={school.id}
                  className='p-4 border-slate-700/50 bg-slate-900/50 hover:border-slate-600 transition'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3'>
                        <Building2 className='w-5 h-5 text-blue-400' />
                        <div>
                          <p className='font-medium text-white'>{school.name}</p>
                          <p className='text-xs text-slate-400'>{school.location}</p>
                        </div>
                      </div>
                      <div className='flex gap-6 mt-2 ml-8'>
                        <span className='text-xs text-slate-400'>
                          Teachers: <span className='text-white'>{school.teacherCount}</span>
                        </span>
                        <span className='text-xs text-slate-400'>
                          Students: <span className='text-white'>{school.studentCount}</span>
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          school.status
                        )}`}
                      >
                        {school.status}
                      </span>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-slate-400 hover:text-white'
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-400 hover:text-red-300'
                        onClick={() => handleDeleteSchool(school.id)}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value='teachers' className='space-y-4'>
            <div className='flex gap-3 mb-4'>
              <div className='flex-1 relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500' />
                <input
                  type='text'
                  placeholder='Search teachers...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className='px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50'
              >
                <option value='all'>All Status</option>
                <option value='active'>Active</option>
                <option value='pending'>Pending</option>
                <option value='inactive'>Inactive</option>
              </select>
              <Button className='bg-purple-600 hover:bg-purple-700'>
                <Plus className='w-4 h-4 mr-2' />
                Add Teacher
              </Button>
            </div>

            <div className='space-y-2'>
              {filteredTeachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className='p-4 border-slate-700/50 bg-slate-900/50 hover:border-slate-600 transition'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3'>
                        <Users className='w-5 h-5 text-purple-400' />
                        <div>
                          <p className='font-medium text-white'>{teacher.name}</p>
                          <p className='text-xs text-slate-400'>{teacher.email}</p>
                        </div>
                      </div>
                      <div className='flex gap-6 mt-2 ml-8'>
                        <span className='text-xs text-slate-400'>
                          {teacher.subject}
                        </span>
                        <span className='text-xs text-slate-400'>
                          Students: <span className='text-white'>{teacher.studentCount}</span>
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          teacher.status
                        )}`}
                      >
                        {teacher.status}
                      </span>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-slate-400 hover:text-white'
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-400 hover:text-red-300'
                        onClick={() => handleDeleteTeacher(teacher.id)}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value='students' className='space-y-4'>
            <div className='flex gap-3 mb-4'>
              <div className='flex-1 relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500' />
                <input
                  type='text'
                  placeholder='Search students...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className='px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50'
              >
                <option value='all'>All Status</option>
                <option value='active'>Active</option>
                <option value='pending'>Pending</option>
                <option value='inactive'>Inactive</option>
              </select>
              <Button className='bg-green-600 hover:bg-green-700'>
                <Plus className='w-4 h-4 mr-2' />
                Add Student
              </Button>
            </div>

            <div className='space-y-2'>
              {filteredStudents.map((student) => (
                <Card
                  key={student.id}
                  className='p-4 border-slate-700/50 bg-slate-900/50 hover:border-slate-600 transition'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3'>
                        <GraduationCap className='w-5 h-5 text-green-400' />
                        <div>
                          <p className='font-medium text-white'>{student.name}</p>
                          <p className='text-xs text-slate-400'>
                            Roll: {student.rollNo} • {student.class}
                          </p>
                        </div>
                      </div>
                      <p className='text-xs text-slate-500 mt-2 ml-8'>
                        Last active: {student.lastActive}
                      </p>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          student.status
                        )}`}
                      >
                        {student.status}
                      </span>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-slate-400 hover:text-white'
                      >
                        <Eye className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-400 hover:text-red-300'
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value='approvals' className='space-y-4'>
            {pendingApprovals.length === 0 ? (
              <Card className='p-12 border-slate-700/50 bg-slate-900/50 text-center'>
                <CheckCircle className='w-12 h-12 text-green-500 mx-auto mb-4' />
                <p className='text-slate-400'>All pending approvals have been reviewed!</p>
              </Card>
            ) : (
              pendingApprovals.map((approval) => (
                <Card
                  key={approval.id}
                  className='p-4 border-slate-700/50 bg-slate-900/50'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3'>
                        {approval.type === 'teacher' && (
                          <Users className='w-5 h-5 text-purple-400' />
                        )}
                        {approval.type === 'school' && (
                          <Building2 className='w-5 h-5 text-blue-400' />
                        )}
                        {approval.type === 'student' && (
                          <GraduationCap className='w-5 h-5 text-green-400' />
                        )}
                        <div>
                          <p className='font-medium text-white'>{approval.name}</p>
                          <p className='text-xs text-slate-400 capitalize'>
                            {approval.type} request
                            {approval.email && ` • ${approval.email}`}
                          </p>
                        </div>
                      </div>
                      <p className='text-xs text-slate-500 mt-2 ml-8'>
                        Applied: {approval.appliedAt}
                      </p>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        className='bg-green-600 hover:bg-green-700 text-white'
                        onClick={() => handleApprove(approval.id)}
                      >
                        <CheckCircle className='w-4 h-4 mr-2' />
                        Approve
                      </Button>
                      <Button
                        variant='outline'
                        className='border-red-500/50 text-red-400 hover:bg-red-500/10'
                        onClick={() => handleReject(approval.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Footer */}
      <div className='mt-8 text-center text-slate-500 text-sm'>
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}
