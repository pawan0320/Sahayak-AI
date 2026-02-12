'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Bell, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

const scheduleData = [
  {
    id: 1,
    time: '09:00 AM',
    type: 'Class',
    subject: 'Mathematics - Grade 9',
    room: 'A-101',
    students: 35,
    status: 'ongoing',
  },
  {
    id: 2,
    time: '10:30 AM',
    type: 'Class',
    subject: 'Science - Grade 10',
    room: 'Lab-01',
    students: 40,
    status: 'upcoming',
  },
  {
    id: 3,
    time: '01:00 PM',
    type: 'Meeting',
    subject: 'Principal Meeting',
    room: 'Conference Room',
    students: 8,
    status: 'upcoming',
  },
  {
    id: 4,
    time: '02:30 PM',
    type: 'Class',
    subject: 'History - Grade 10',
    room: 'A-102',
    students: 38,
    status: 'upcoming',
  },
];

export default function SchedulePage() {
  const [meetings, setMeetings] = useState({
    1: 'pending',
    3: 'pending',
  } as Record<number, 'pending' | 'accepted' | 'declined'>);

  const handleMeetingResponse = (id: number, response: 'accepted' | 'declined') => {
    setMeetings((prev) => ({ ...prev, [id]: response }));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="teacher" />

      <div className="flex-1 flex flex-col">
        <Header title="Schedule & Calendar" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Today's Schedule</h2>
                  <p className="text-muted-foreground">Friday, December 13, 2024</p>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  View Month
                </Button>
              </div>

              <div className="space-y-3">
                {scheduleData.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <Card
                      className={`p-6 border-border/50 hover:border-primary/50 transition ${
                        item.status === 'ongoing' ? 'border-green-500/50 bg-green-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 flex gap-6">
                          {/* Time */}
                          <div className="min-w-fit">
                            <div className="flex items-center gap-2 text-lg font-bold">
                              <Clock className="w-5 h-5 text-primary" />
                              {item.time}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 capitalize">
                              {item.status === 'ongoing' ? '🔴 Live Now' : 'Upcoming'}
                            </p>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium">
                                {item.type}
                              </span>
                            </div>
                            <h3 className="font-semibold mb-3">{item.subject}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {item.room}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {item.students} students
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 ml-4">
                          {item.type === 'Meeting' && (
                            <>
                              {meetings[item.id] === 'pending' ? (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                                    onClick={() => handleMeetingResponse(item.id, 'accepted')}
                                  >
                                    <Check className="w-4 h-4" />
                                    Join
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-1"
                                    onClick={() => handleMeetingResponse(item.id, 'declined')}
                                  >
                                    <X className="w-4 h-4" />
                                    Decline
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  size="sm"
                                  variant={meetings[item.id] === 'accepted' ? 'default' : 'outline'}
                                  disabled
                                >
                                  {meetings[item.id] === 'accepted' ? '✓ Accepted' : '✗ Declined'}
                                </Button>
                              )}
                            </>
                          )}
                          {item.type === 'Class' && (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                              asChild
                            >
                              <a href="/classroom/setup">Start Class</a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="p-6 border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-semibold">Notifications</h3>
                </div>
                <div className="space-y-3">
                  {[
                    'Class reminder: Mathematics at 09:00 AM',
                    'Principal meeting invitation for 01:00 PM',
                    'New assignment submitted: 5 students',
                  ].map((notification, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition cursor-pointer"
                    >
                      <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                      <p className="text-sm">{notification}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Calendar Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="p-6 border-border/50">
                <h3 className="text-lg font-semibold mb-4">December 2024</h3>
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const date = i + 1;
                    const isToday = date === 13;
                    return (
                      <div
                        key={date}
                        className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition ${
                          isToday
                            ? 'bg-gradient-to-br from-primary to-accent text-foreground font-bold'
                            : 'hover:bg-secondary'
                        }`}
                      >
                        {date}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
