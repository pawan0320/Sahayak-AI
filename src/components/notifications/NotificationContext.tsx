'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import notificationService, {
  NotificationData,
  CalendarEvent,
  NotificationPreferences,
} from '@/lib/notificationService';
import { useAuth } from '@/components/auth/AuthContext';

interface NotificationContextType {
  notifications: NotificationData[];
  calendarEvents: CalendarEvent[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  isLoading: boolean;

  // Notification actions
  fetchNotifications: () => Promise<void>;
  createNotification: (notification: Omit<NotificationData, 'id' | 'createdAt'>) => Promise<string>;
  respondToNotification: (
    notificationId: string,
    action: 'joined' | 'declined'
  ) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;

  // Calendar actions
  fetchCalendarEvents: () => Promise<void>;
  createCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<string>;
  updateCalendarEvent: (eventId: string, updates: Partial<CalendarEvent>) => Promise<void>;
  deleteCalendarEvent: (eventId: string) => Promise<void>;

  // Preferences
  fetchPreferences: () => Promise<void>;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { currentUser, userRole } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!currentUser || !currentUser.schoolId) return;

    try {
      setIsLoading(true);
      const data = await notificationService.getUserNotifications(
        currentUser.uid,
        currentUser.schoolId,
        50
      );
      setNotifications(data);

      // Get unread count
      const count = await notificationService.getUnreadNotificationsCount(
        currentUser.uid,
        currentUser.schoolId
      );
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch calendar events
  const fetchCalendarEvents = async () => {
    if (!currentUser || !currentUser.schoolId) return;

    try {
      setIsLoading(true);
      const data = await notificationService.getUserCalendarEvents(
        currentUser.uid,
        currentUser.schoolId
      );
      setCalendarEvents(data);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create notification
  const createNotification = async (
    notification: Omit<NotificationData, 'id' | 'createdAt'>
  ): Promise<string> => {
    if (!currentUser || !currentUser.schoolId) throw new Error('User not authenticated');

    try {
      const id = await notificationService.createNotification({
        ...notification,
        userId: currentUser.uid,
        schoolId: currentUser.schoolId,
      });
      await fetchNotifications();
      return id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  };

  // Respond to notification
  const respondToNotification = async (
    notificationId: string,
    action: 'joined' | 'declined'
  ) => {
    try {
      await notificationService.updateNotificationStatus(notificationId, action);
      await fetchNotifications();
    } catch (error) {
      console.error('Error responding to notification:', error);
      throw error;
    }
  };

  // Mark as read
  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setUnreadCount(Math.max(0, unreadCount - 1));
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!currentUser || !currentUser.schoolId) return;

    try {
      await notificationService.markAllAsRead(currentUser.uid, currentUser.schoolId);
      setUnreadCount(0);
      setNotifications(
        notifications.map((n) => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  };

  // Create calendar event
  const createCalendarEvent = async (
    event: Omit<CalendarEvent, 'id'>
  ): Promise<string> => {
    if (!currentUser || !currentUser.schoolId) throw new Error('User not authenticated');

    try {
      const id = await notificationService.createCalendarEvent({
        ...event,
        userId: currentUser.uid,
        schoolId: currentUser.schoolId,
      });
      await fetchCalendarEvents();
      return id;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  };

  // Update calendar event
  const updateCalendarEvent = async (
    eventId: string,
    updates: Partial<CalendarEvent>
  ) => {
    try {
      await notificationService.updateCalendarEvent(eventId, updates);
      await fetchCalendarEvents();
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  };

  // Delete calendar event
  const deleteCalendarEvent = async (eventId: string) => {
    try {
      await notificationService.deleteCalendarEvent(eventId);
      setCalendarEvents(calendarEvents.filter((e) => e.id !== eventId));
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  };

  // Fetch preferences
  const fetchPreferences = async () => {
    if (!currentUser) return;

    try {
      const prefs = await notificationService.getNotificationPreferences(currentUser.uid);
      setPreferences(prefs);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  // Update preferences
  const updatePreferences = async (
    newPreferences: Partial<NotificationPreferences>
  ) => {
    if (!currentUser) return;

    try {
      await notificationService.updateNotificationPreferences(
        currentUser.uid,
        newPreferences
      );
      setPreferences({
        ...preferences!,
        ...newPreferences,
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  // Load data on mount and when user changes
  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      fetchCalendarEvents();
      fetchPreferences();

      // Set up auto-refresh every 30 seconds
      const interval = setInterval(() => {
        fetchNotifications();
        fetchCalendarEvents();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [currentUser]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        calendarEvents,
        unreadCount,
        preferences,
        isLoading,
        fetchNotifications,
        createNotification,
        respondToNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchCalendarEvents,
        createCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        fetchPreferences,
        updatePreferences,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within NotificationProvider'
    );
  }
  return context;
}
