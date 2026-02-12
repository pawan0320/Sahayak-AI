'use client';

import { motion } from 'framer-motion';
import { User, Edit2, Save, BarChart3, Users, BookOpen, Award, Calendar, Download, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { SimpleBarChart } from '@/components/charts/SimpleCharts';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Rajesh Kumar',
    email: user?.email || 'rajesh.kumar@school.com',
    phone: user?.phone || '+91 98765 43210',
    school: user?.school || 'Delhi Public School',
    designation: 'Senior Science Teacher',
    experience: '8 years',
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const stats = [
    { title: 'Total Students', value: '156', icon: <Users className="w-6 h-6" /> },
    { title: 'Lessons Created', value: '42', icon: <BookOpen className="w-6 h-6" /> },
    { title: 'Avg Student Score', value: '84%', icon: <Award className="w-6 h-6" /> },
    { title: 'Classes', value: '4', icon: <BarChart3 className="w-6 h-6" /> },
  ];

  const classSchedules = [
    { id: 1, class: '10-A', subject: 'Science', day: 'Monday', time: '09:00 - 10:00', room: '205' },
    { id: 2, class: '10-B', subject: 'Science', day: 'Tuesday', time: '10:00 - 11:00', room: '206' },
    { id: 3, class: '9-C', subject: 'Science', day: 'Wednesday', time: '11:00 - 12:00', room: '305' },
    { id: 4, class: '11-A', subject: 'Science', day: 'Thursday', time: '02:00 - 03:00', room: '310' },
    { id: 5, class: '12-B', subject: 'Science', day: 'Friday', time: '09:00 - 10:00', room: '311' },
  ];

  const uploadedMaterials = [
    { id: 1, title: 'Physics Basics', type: 'PDF', size: '2.4 MB', uploadedAt: '2024-01-15', downloads: 23 },
    { id: 2, title: 'Chemistry Lab Procedures', type: 'PDF', size: '1.8 MB', uploadedAt: '2024-01-18', downloads: 45 },
    { id: 3, title: 'Biology Diagrams', type: 'PPT', size: '3.2 MB', uploadedAt: '2024-01-20', downloads: 67 },
    { id: 4, title: 'Equations Reference', type: 'Excel', size: '856 KB', uploadedAt: '2024-02-01', downloads: 34 },
    { id: 5, title: 'Experiment Videos', type: 'Video', size: '45 MB', uploadedAt: '2024-02-05', downloads: 89 },
  ];

  const studentPerformanceData = [
    { label: 'Aman', value: 85 },
    { label: 'Priya', value: 92 },
    { label: 'Raj', value: 78 },
    { label: 'Neha', value: 88 },
    { label: 'Vikram', value: 95 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1">
          <Header title="My Profile" showMenu={true} />

          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
            {/* Personal Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Card className="p-8 border-border/50 bg-gradient-to-br from-background to-secondary/10">
                <div className="flex items-start justify-between mb-6 flex-col md:flex-row gap-4">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <User className="w-12 h-12 text-foreground" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
                      <p className="text-muted-foreground mb-1">{profileData.designation}</p>
                      <p className="text-sm text-muted-foreground">{profileData.school}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? 'default' : 'outline'}
                    className="gap-2"
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4" />
                        Done
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    ) : (
                      <p>{profileData.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    ) : (
                      <p>{profileData.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">School</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.school}
                        onChange={(e) => handleInputChange('school', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    ) : (
                      <p>{profileData.school}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Experience</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    ) : (
                      <p>{profileData.experience}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex gap-3">
                    <Button onClick={handleSave} className="flex-1">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 border-border/50 hover:border-primary/30 transition">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>

            {/* Class Schedules Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Card className="p-6 border-border/50 bg-gradient-to-br from-background to-secondary/10">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold">Class Schedules</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-semibold">Class</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold">Subject</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold">Day</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold">Time</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold">Room</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classSchedules.map((schedule, index) => (
                        <motion.tr
                          key={schedule.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                          className="border-b border-border/50 hover:bg-secondary/30 transition"
                        >
                          <td className="py-3 px-4 font-medium">{schedule.class}</td>
                          <td className="py-3 px-4">{schedule.subject}</td>
                          <td className="py-3 px-4">{schedule.day}</td>
                          <td className="py-3 px-4 text-muted-foreground">{schedule.time}</td>
                          <td className="py-3 px-4 text-muted-foreground">{schedule.room}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>

            {/* Lesson Materials Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <Card className="p-6 border-border/50 bg-gradient-to-br from-background to-secondary/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-accent" />
                    <h2 className="text-2xl font-bold">Uploaded Lesson Materials</h2>
                  </div>
                  <Button variant="outline" size="sm">Upload New</Button>
                </div>

                <div className="space-y-3">
                  {uploadedMaterials.map((material, index) => (
                    <motion.div
                      key={material.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-1">{material.title}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>{material.type}</span>
                            <span>{material.size}</span>
                            <span>Uploaded: {material.uploadedAt}</span>
                            <span className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              {material.downloads} downloads
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Student Performance Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <Card className="p-6 border-border/50 bg-gradient-to-br from-background to-secondary/10">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <h2 className="text-2xl font-bold">Student Performance Dashboard</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SimpleBarChart
                    title="Top Performers"
                    data={studentPerformanceData}
                    delay={0.5}
                  />

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-secondary/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Average Class Score</span>
                        <span className="text-2xl font-bold text-primary">84%</span>
                      </div>
                      <div className="w-full bg-secondary/40 rounded-full h-2">
                        <div className="bg-primary rounded-full h-2 w-4/5" />
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Attendance Rate</span>
                        <span className="text-2xl font-bold text-accent">92%</span>
                      </div>
                      <div className="w-full bg-secondary/40 rounded-full h-2">
                        <div className="bg-accent rounded-full h-2 w-11/12" />
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-destructive/10">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-destructive" />
                        <span className="font-medium">Students Needing Support</span>
                      </div>
                      <p className="text-2xl font-bold text-destructive">3</p>
                      <p className="text-xs text-muted-foreground mt-1">Consider scheduling additional sessions</p>
                    </div>

                    <Button className="w-full gap-2">
                      <TrendingUp className="w-4 h-4" />
                      View Detailed Analytics
                    </Button>
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
