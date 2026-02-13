'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calendar,
  Bell,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  MapPin,
  Users,
  BookOpen,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  userId: string;
  schoolId: string;
  title: string;
  type: 'class' | 'meeting' | 'event';
  startTime: string;
  endTime: string;
  location?: string;
  participants?: number;
  description?: string;
  date: Date;
  createdAt: Date;
}

interface Notification {
  id: string;
  userId: string;
  schoolId: string;
  type: 'class-reminder' | 'meeting-alert' | 'event-update';
  title: string;
  message: string;
  timestamp: Date;
  icon: React.ReactNode;
  status: 'pending' | 'joined' | 'declined';
  event?: {
    id: string;
    title: string;
    startTime: string;
  };
}

const mockEvents: CalendarEvent[] = [
  {
    id: 'e1',
    userId: 'user1',
    schoolId: 'school1',
    date: new Date(2026, 1, 12, 10, 0),
    title: 'Mathematics Class - Grade 5',
    type: 'class',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    location: 'Classroom 5-A',
    participants: 42,
    description: 'Algebra basics and equations',
    createdAt: new Date(2026, 1, 12, 10, 0),
  },
  {
    id: 'e2',
    userId: 'user1',
    schoolId: 'school1',
    date: new Date(2026, 1, 12, 14, 0),
    title: 'Principal Meeting - Academic Planning',
    type: 'meeting',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    location: 'Principal Office',
    description: 'Q1 academic performance review',
    createdAt: new Date(2026, 1, 12, 14, 0),
  },
  {
    id: 'e3',
    userId: 'user1',
    schoolId: 'school1',
    date: new Date(2026, 1, 13, 9, 30),
    title: 'Science Lab Session',
    type: 'class',
    startTime: '9:30 AM',
    endTime: '10:30 AM',
    location: 'Science Lab',
    participants: 38,
    description: 'Experiments on plant biology',
    createdAt: new Date(2026, 1, 13, 9, 30),
  },
  {
    id: 'e4',
    userId: 'user1',
    schoolId: 'school1',
    date: new Date(2026, 1, 13, 15, 0),
    title: 'Staff Development Workshop',
    type: 'event',
    startTime: '3:00 PM',
    endTime: '4:30 PM',
    location: 'Auditorium',
    description: 'AI-assisted teaching methodologies',
    createdAt: new Date(2026, 1, 13, 15, 0),
  },
  {
    id: 'e5',
    userId: 'user1',
    schoolId: 'school1',
    date: new Date(2026, 1, 14, 11, 0),
    title: 'English Literature Class',
    type: 'class',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    location: 'Classroom 5-C',
    participants: 35,
    createdAt: new Date(2026, 1, 14, 11, 0),
  },
  {
    id: 'e6',
    userId: 'user1',
    schoolId: 'school1',
    date: new Date(2026, 1, 15, 10, 30),
    title: 'Principal Meeting - Safety Review',
    type: 'meeting',
    startTime: '10:30 AM',
    endTime: '11:30 AM',
    location: 'Principal Office',
    description: 'Campus safety compliance check',
    createdAt: new Date(2026, 1, 15, 10, 30),
  },
];

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'user1',
    schoolId: 'school1',
    type: 'class-reminder',
    title: 'Mathematics Class Starting Soon',
    message: 'Your Mathematics class (Grade 5) starts in 15 minutes in Classroom 5-A',
    timestamp: new Date(Date.now() - 15 * 60000),
    icon: <BookOpen className='w-5 h-5 text-blue-400' />,
    status: 'pending',
    event: {
      id: 'e1',
      title: 'Mathematics Class - Grade 5',
      startTime: '10:00 AM',
    },
  },
  {
    id: 'n2',
    userId: 'user1',
    schoolId: 'school1',
    type: 'meeting-alert',
    title: 'Principal Meeting Scheduled',
    message: 'Academic Planning meeting with Principal scheduled for today at 2:00 PM. Please review attached documents.',
    timestamp: new Date(Date.now() - 2 * 3600000),
    icon: <AlertCircle className='w-5 h-5 text-red-400' />,
    status: 'pending',
    event: {
      id: 'e2',
      title: 'Principal Meeting - Academic Planning',
      startTime: '2:00 PM',
    },
  },
  {
    id: 'n3',
    userId: 'user1',
    schoolId: 'school1',
    type: 'class-reminder',
    title: 'Science Lab Session Tomorrow',
    message: 'Don\'t forget: Science Lab Session tomorrow at 9:30 AM in the Science Lab. Prepare lab coats.',
    timestamp: new Date(Date.now() - 24 * 3600000),
    icon: <BookOpen className='w-5 h-5 text-green-400' />,
    status: 'joined',
    event: {
      id: 'e3',
      title: 'Science Lab Session',
      startTime: '9:30 AM',
    },
  },
  {
    id: 'n4',
    userId: 'user1',
    schoolId: 'school1',
    type: 'event-update',
    title: 'Staff Development Workshop Update',
    message: 'New materials available for the Staff Development Workshop. Check your portal for the updated agenda.',
    timestamp: new Date(Date.now() - 48 * 3600000),
    icon: <MessageSquare className='w-5 h-5 text-purple-400' />,
    status: 'joined',
  },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1));
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filterType, setFilterType] = useState<string>('all');
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(mockEvents);

  const handleResponseAction = (notificationId: string, action: 'joined' | 'declined') => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, status: action } : n
      )
    );
  };

  const handleDismiss = (notificationId: string) => {
    setNotifications(notifications.filter((n) => n.id !== notificationId));
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (day: number) => {
    return calendarEvents.filter(
      (event) =>
        event.date.getDate() === day &&
        event.date.getMonth() === currentMonth.getMonth()
    );
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const filteredNotifications =
    filterType === 'all'
      ? notifications
      : notifications.filter((n) => n.type === filterType);

  const upcomingEvents = calendarEvents
    .filter((e) => e.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'class-reminder':
        return 'bg-blue-500/10 border-blue-500/30';
      case 'meeting-alert':
        return 'bg-red-500/10 border-red-500/30';
      case 'event-update':
        return 'bg-purple-500/10 border-purple-500/30';
      default:
        return 'bg-slate-500/10 border-slate-500/30';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class':
        return 'bg-blue-500/20 text-blue-400';
      case 'meeting':
        return 'bg-red-500/20 text-red-400';
      case 'event':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
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
            <Bell className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>
              Schedule & Notifications
            </h1>
            <p className='text-slate-400'>Stay updated with your classes, meetings & events</p>
          </div>
        </div>
      </motion.div>

      {/* Main Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-3 bg-slate-900/50 border border-slate-700/50'>
            <TabsTrigger value='notifications' className='data-[state=active]:bg-blue-500/20'>
              Notifications
              {notifications.filter((n) => n.status === 'pending').length > 0 && (
                <span className='ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full'>
                  {notifications.filter((n) => n.status === 'pending').length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value='calendar' className='data-[state=active]:bg-blue-500/20'>
              Calendar
            </TabsTrigger>
            <TabsTrigger value='schedule' className='data-[state=active]:bg-blue-500/20'>
              Schedule
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value='notifications' className='space-y-4'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-semibold text-white'>Recent Notifications</h2>
              <div className='flex gap-2'>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className='px-3 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                >
                  <option value='all'>All Types</option>
                  <option value='class-reminder'>Class Reminders</option>
                  <option value='meeting-alert'>Meeting Alerts</option>
                  <option value='event-update'>Event Updates</option>
                </select>
              </div>
            </div>

            {filteredNotifications.length === 0 ? (
              <Card className='p-12 border-slate-700/50 bg-slate-900/50 text-center'>
                <CheckCircle className='w-12 h-12 text-green-500 mx-auto mb-4' />
                <p className='text-slate-400'>All caught up! No new notifications.</p>
              </Card>
            ) : (
              <div className='space-y-3'>
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card
                      className={`p-4 border ${getNotificationColor(
                        notification.type
                      )} hover:border-slate-500/50 transition`}
                    >
                      <div className='flex gap-4'>
                        {/* Icon */}
                        <div className='flex-shrink-0 pt-1'>{notification.icon}</div>

                        {/* Content */}
                        <div className='flex-1'>
                          <div className='flex items-start justify-between mb-2'>
                            <h3 className='font-semibold text-white'>{notification.title}</h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                notification.status === 'joined'
                                  ? 'bg-green-500/20 text-green-400'
                                  : notification.status === 'declined'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-yellow-500/20 text-yellow-400'
                              }`}
                            >
                              {notification.status}
                            </span>
                          </div>
                          <p className='text-sm text-slate-300 mb-3'>{notification.message}</p>

                          {/* Event Info */}
                          {notification.event && (
                            <div className='mb-3 p-2 bg-slate-800/50 rounded border border-slate-700/50'>
                              <div className='flex items-center gap-2 text-xs text-slate-400'>
                                <Clock className='w-4 h-4' />
                                <span>{notification.event.startTime}</span>
                              </div>
                              <p className='text-sm text-slate-300 mt-1'>{notification.event.title}</p>
                            </div>
                          )}

                          {/* Actions */}
                          {notification.status === 'pending' && (
                            <div className='flex gap-2'>
                              <Button
                                size='sm'
                                className='bg-green-600 hover:bg-green-700 text-white'
                                onClick={() =>
                                  handleResponseAction(notification.id, 'joined')
                                }
                              >
                                <CheckCircle className='w-4 h-4 mr-1' />
                                Join Now
                              </Button>
                              <Button
                                size='sm'
                                variant='outline'
                                className='border-red-500/50 text-red-400 hover:bg-red-500/10'
                                onClick={() =>
                                  handleResponseAction(notification.id, 'declined')
                                }
                              >
                                Not Interested
                              </Button>
                              <Button
                                size='sm'
                                variant='ghost'
                                className='text-slate-400 hover:text-slate-300'
                                onClick={() => handleDismiss(notification.id)}
                              >
                                <X className='w-4 h-4' />
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Time */}
                        <div className='flex-shrink-0 text-right'>
                          <p className='text-xs text-slate-500'>
                            {notification.timestamp.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <p className='text-xs text-slate-600 mt-1'>
                            {notification.timestamp.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value='calendar' className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Calendar */}
              <div className='lg:col-span-2'>
                <Card className='p-6 border-slate-700/50 bg-slate-900/50'>
                  <div className='flex items-center justify-between mb-6'>
                    <h3 className='text-lg font-semibold text-white'>{monthYear}</h3>
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() =>
                          setCurrentMonth(
                            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                          )
                        }
                      >
                        <ChevronLeft className='w-4 h-4' />
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() =>
                          setCurrentMonth(
                            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                          )
                        }
                      >
                        <ChevronRight className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>

                  {/* Weekday Headers */}
                  <div className='grid grid-cols-7 gap-2 mb-4'>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div
                        key={day}
                        className='text-center text-xs font-semibold text-slate-400 py-2'
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className='grid grid-cols-7 gap-2'>
                    {days.map((day, i) =>
                      day === null ? (
                        <div key={`empty-${i}`} className='aspect-square' />
                      ) : (
                        <motion.div
                          key={day}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`aspect-square p-2 rounded border transition ${
                            day === new Date().getDate() &&
                            currentMonth.getMonth() === new Date().getMonth()
                              ? 'border-blue-500 bg-blue-500/20'
                              : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'
                          }`}
                        >
                          <div className='text-sm font-semibold text-white mb-1'>{day}</div>
                          <div className='space-y-0.5'>
                            {getEventsForDate(day).map((event) => (
                              <div
                                key={event.id}
                                className={`text-xs px-1 py-0.5 rounded truncate ${getEventTypeColor(
                                  event.type
                                )}`}
                                title={event.title}
                              >
                                {event.type === 'class' && '📚'}
                                {event.type === 'meeting' && '👔'}
                                {event.type === 'event' && '📌'}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>

                  {/* Legend */}
                  <div className='mt-6 pt-6 border-t border-slate-700/50 flex flex-wrap gap-4 text-sm'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-blue-500 rounded'></div>
                      <span className='text-slate-400'>Classes</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-red-500 rounded'></div>
                      <span className='text-slate-400'>Meetings</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-purple-500 rounded'></div>
                      <span className='text-slate-400'>Events</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Upcoming Events Sidebar */}
              <div>
                <Card className='p-6 border-slate-700/50 bg-slate-900/50'>
                  <h3 className='text-lg font-semibold text-white mb-4'>Upcoming Events</h3>
                  <div className='space-y-3'>
                    {upcomingEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition'
                      >
                        <div className='flex items-start gap-2 mb-2'>
                          <span
                            className={`text-xs px-2 py-1 rounded font-medium ${getEventTypeColor(
                              event.type
                            )}`}
                          >
                            {event.type}
                          </span>
                        </div>
                        <p className='text-sm font-medium text-white mb-1'>{event.title}</p>
                        <div className='space-y-1 text-xs text-slate-400'>
                          <div className='flex items-center gap-1'>
                            <Calendar className='w-3 h-3' />
                            {event.date.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <div className='flex items-center gap-1'>
                            <Clock className='w-3 h-3' />
                            {event.startTime} - {event.endTime}
                          </div>
                          {event.location && (
                            <div className='flex items-center gap-1'>
                              <MapPin className='w-3 h-3' />
                              {event.location}
                            </div>
                          )}
                          {event.participants && (
                            <div className='flex items-center gap-1'>
                              <Users className='w-3 h-3' />
                              {event.participants} participants
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value='schedule' className='space-y-4'>
            <h2 className='text-lg font-semibold text-white'>Your Schedule</h2>
            <div className='space-y-3'>
              {calendarEvents
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className='p-4 border-slate-700/50 bg-slate-900/50 hover:border-slate-600 transition'>
                      <div className='flex items-start gap-4'>
                        {/* Date Circle */}
                        <div className='flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex flex-col items-center justify-center text-white'>
                          <p className='text-xs font-medium'>
                            {event.date.toLocaleDateString('en-US', {
                              month: 'short',
                            })}
                          </p>
                          <p className='text-lg font-bold'>
                            {event.date.getDate()}
                          </p>
                        </div>

                        {/* Event Details */}
                        <div className='flex-1'>
                          <div className='flex items-center gap-2 mb-1'>
                            <h3 className='text-lg font-semibold text-white'>{event.title}</h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${getEventTypeColor(
                                event.type
                              )}`}
                            >
                              {event.type}
                            </span>
                          </div>
                          {event.description && (
                            <p className='text-sm text-slate-400 mb-2'>{event.description}</p>
                          )}
                          <div className='flex flex-wrap gap-4 text-sm text-slate-400'>
                            <div className='flex items-center gap-1'>
                              <Clock className='w-4 h-4 text-blue-400' />
                              {event.startTime} - {event.endTime}
                            </div>
                            {event.location && (
                              <div className='flex items-center gap-1'>
                                <MapPin className='w-4 h-4 text-blue-400' />
                                {event.location}
                              </div>
                            )}
                            {event.participants && (
                              <div className='flex items-center gap-1'>
                                <Users className='w-4 h-4 text-blue-400' />
                                {event.participants} participants
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action */}
                        <div className='flex-shrink-0'>
                          {event.type === 'class' && (
                            <Button className='bg-blue-600 hover:bg-blue-700'>
                              Join Class
                            </Button>
                          )}
                          {event.type === 'meeting' && (
                            <Button className='bg-red-600 hover:bg-red-700'>
                              See Details
                            </Button>
                          )}
                          {event.type === 'event' && (
                            <Button className='bg-purple-600 hover:bg-purple-700'>
                              Mark RSVP
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='mt-12'
      >
        <Card className='p-6 border-slate-700/50 bg-slate-900/50'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Settings className='w-5 h-5 text-slate-400' />
              <div>
                <h3 className='font-semibold text-white'>Notification Preferences</h3>
                <p className='text-sm text-slate-400'>Choose which notifications you want to receive</p>
              </div>
            </div>
            <Button variant='outline' size='sm'>
              Manage
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
