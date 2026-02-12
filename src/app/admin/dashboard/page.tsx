'use client';

import { motion } from 'framer-motion';
import { Users, Book, TrendingUp, AlertCircle, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const systemData = [
  { name: 'Mon', teachers: 45, students: 1200, active: 1100 },
  { name: 'Tue', teachers: 46, students: 1220, active: 1120 },
  { name: 'Wed', teachers: 45, students: 1200, active: 1050 },
  { name: 'Thu', teachers: 47, students: 1250, active: 1180 },
  { name: 'Fri', teachers: 48, students: 1280, active: 1250 },
];

const schools = [
  { id: 1, name: 'Delhi Public School', teachers: 24, students: 520, city: 'Delhi' },
  { id: 2, name: 'St. Mary Academy', teachers: 18, students: 380, city: 'Mumbai' },
  { id: 3, name: 'Government School', teachers: 12, students: 290, city: 'Bangalore' },
];

export default function AdminDashboard() {
  const kpis = [
    {
      icon: Users,
      label: 'Total Teachers',
      value: '120+',
      change: '+8',
      color: 'from-primary/20 to-primary/10',
    },
    {
      icon: Users,
      label: 'Total Students',
      value: '5,420+',
      change: '+150',
      color: 'from-accent/20 to-accent/10',
    },
    {
      icon: Book,
      label: 'Active Classes',
      value: '324',
      change: '+12',
      color: 'from-green-500/20 to-green-500/10',
    },
    {
      icon: AlertCircle,
      label: 'Pending Approvals',
      value: '8',
      change: '-2',
      color: 'from-orange-500/20 to-orange-500/10',
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="admin" />

      <div className="flex-1 flex flex-col">
        <Header title="System Administration" />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
            <p className="text-muted-foreground">Manage schools, teachers, and system analytics</p>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className={`p-6 border-border/50 hover:border-primary/50 transition bg-gradient-to-br ${kpi.color}`}>
                    <Icon className="w-8 h-8 text-primary mb-3" />
                    <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
                    <div className="flex justify-between items-end">
                      <p className="text-2xl font-bold">{kpi.value}</p>
                      <p className="text-xs text-green-600">{kpi.change}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="p-6 border-border/50">
                <h3 className="text-lg font-semibold mb-4">System Activity</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={systemData}>
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
                        dataKey="active"
                        stroke="var(--accent)"
                        strokeWidth={2}
                        dot={{ fill: 'var(--accent)', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="p-6 border-border/50 h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Admin Panel</h3>
                <div className="space-y-3 flex-1">
                  {[
                    'Manage Schools',
                    'Approve Teachers',
                    'Review Reports',
                    'System Settings',
                  ].map((action, i) => (
                    <Button key={i} variant="outline" className="w-full justify-start">
                      {action}
                    </Button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Schools Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="p-6 border-border/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Registered Schools</h3>
                <Button size="sm">Add School</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium text-muted-foreground">School Name</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Teachers</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Students</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">City</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schools.map((school) => (
                      <tr key={school.id} className="border-b border-border/50 hover:bg-secondary/30 transition">
                        <td className="py-3 font-medium">{school.name}</td>
                        <td className="py-3">{school.teachers}</td>
                        <td className="py-3">{school.students}</td>
                        <td className="py-3 text-muted-foreground">{school.city}</td>
                        <td className="py-3">
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          {/* Pending Approvals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="p-6 border-border/50">
              <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div>
                      <p className="font-medium">Teacher {i} - XYZ School</p>
                      <p className="text-sm text-muted-foreground">Pending verification</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-500/10">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-500/10">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
