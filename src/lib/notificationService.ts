import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './authService';

export interface CalendarEvent {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  type: 'class' | 'meeting' | 'event';
  startTime: Timestamp;
  endTime: Timestamp;
  location?: string;
  participants?: number;
  classId?: string;
  schoolId: string;
}

export interface NotificationData {
  id?: string;
  userId: string;
  type: 'class-reminder' | 'meeting-alert' | 'event-update' | 'attendance';
  title: string;
  message: string;
  icon?: string;
  status: 'pending' | 'joined' | 'declined' | 'read';
  eventId?: string;
  createdAt?: Timestamp;
  scheduledFor?: Timestamp;
  isRead?: boolean;
  schoolId: string;
}

export interface NotificationPreferences {
  userId: string;
  classReminders: boolean;
  meetingAlerts: boolean;
  eventUpdates: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  remindersBefore: number; // minutes before event
}

class NotificationService {
  /**
   * Create a new calendar event
   */
  async createCalendarEvent(event: CalendarEvent): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'calendarEvents'), {
        ...event,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  /**
   * Get all calendar events for a user
   */
  async getUserCalendarEvents(userId: string, schoolId: string): Promise<CalendarEvent[]> {
    try {
      const q = query(
        collection(db, 'calendarEvents'),
        where('userId', '==', userId),
        where('schoolId', '==', schoolId),
        orderBy('startTime', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc: any): CalendarEvent => ({
        id: doc.id,
        ...doc.data(),
      } as CalendarEvent));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  /**
   * Get calendar events for a school
   */
  async getSchoolCalendarEvents(schoolId: string): Promise<CalendarEvent[]> {
    try {
      const q = query(
        collection(db, 'calendarEvents'),
        where('schoolId', '==', schoolId),
        orderBy('startTime', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc: any): CalendarEvent => ({
        id: doc.id,
        ...doc.data(),
      } as CalendarEvent));
    } catch (error) {
      console.error('Error fetching school calendar events:', error);
      throw error;
    }
  }

  /**
   * Update calendar event
   */
  async updateCalendarEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<void> {
    try {
      await updateDoc(doc(db, 'calendarEvents', eventId), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  /**
   * Delete calendar event
   */
  async deleteCalendarEvent(eventId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'calendarEvents', eventId));
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  /**
   * Create a new notification
   */
  async createNotification(notification: NotificationData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notification,
        createdAt: Timestamp.now(),
        isRead: false,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Get notifications for a user
   */
  async getUserNotifications(
    userId: string,
    schoolId: string,
    limit: number = 50
  ): Promise<NotificationData[]> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('schoolId', '==', schoolId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .slice(0, limit)
        .map((doc: any): NotificationData => ({
          id: doc.id,
          ...doc.data(),
        } as NotificationData));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Get unread notifications count
   */
  async getUnreadNotificationsCount(userId: string, schoolId: string): Promise<number> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('schoolId', '==', schoolId),
        where('isRead', '==', false)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Get pending actions (notifications requiring response)
   */
  async getPendingNotifications(userId: string, schoolId: string): Promise<NotificationData[]> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('schoolId', '==', schoolId),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc: any): NotificationData => ({
        id: doc.id,
        ...doc.data(),
      } as NotificationData));
    } catch (error) {
      console.error('Error fetching pending notifications:', error);
      throw error;
    }
  }

  /**
   * Update notification status
   */
  async updateNotificationStatus(
    notificationId: string,
    status: 'pending' | 'joined' | 'declined' | 'read'
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        status,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating notification status:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        isRead: true,
        readAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string, schoolId: string): Promise<void> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('schoolId', '==', schoolId),
        where('isRead', '==', false)
      );

      const querySnapshot = await getDocs(q);
      const batch: Array<Promise<void>> = [];

      querySnapshot.docs.forEach((doc: any): void => {
        batch.push(
          updateDoc(doc.ref, {
            isRead: true,
            readAt: Timestamp.now(),
          })
        );
      });

      await Promise.all(batch);
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Get or create notification preferences
   */
  async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const q = query(
        collection(db, 'notificationPreferences'),
        where('userId', '==', userId)
      );

      const querySnapshot: any = await getDocs(q);
      if (querySnapshot.empty) {
        // Create default preferences
        const defaultPrefs: NotificationPreferences = {
          userId,
          classReminders: true,
          meetingAlerts: true,
          eventUpdates: true,
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          remindersBefore: 15,
        };

        const docRef = await addDoc(
          collection(db, 'notificationPreferences'),
          defaultPrefs
        );

        return {
          ...defaultPrefs,
        };
      }

      const doc = querySnapshot.docs[0];
      return {
        ...doc.data(),
        id: doc.id,
      } as NotificationPreferences & { id: string };
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    try {
      const q = query(
        collection(db, 'notificationPreferences'),
        where('userId', '==', userId)
      );

      const querySnapshot: any = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef: any = querySnapshot.docs[0];
        await updateDoc(docRef.ref, preferences);
      }
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  /**
   * Create class reminder notification
   */
  async createClassReminder(
    userId: string,
    schoolId: string,
    eventId: string,
    eventTitle: string,
    eventTime: Timestamp
  ): Promise<string> {
    return this.createNotification({
      userId,
      schoolId,
      type: 'class-reminder',
      title: `${eventTitle} Starting Soon`,
      message: `Your class starts in 15 minutes`,
      eventId,
      status: 'pending',
      scheduledFor: eventTime,
    });
  }

  /**
   * Create meeting alert notification
   */
  async createMeetingAlert(
    userId: string,
    schoolId: string,
    eventId: string,
    eventTitle: string,
    eventTime: Timestamp
  ): Promise<string> {
    return this.createNotification({
      userId,
      schoolId,
      type: 'meeting-alert',
      title: `Principal Meeting: ${eventTitle}`,
      message: `Meeting scheduled. Please review attached documents.`,
      eventId,
      status: 'pending',
      scheduledFor: eventTime,
    });
  }

  /**
   * Create event update notification
   */
  async createEventUpdate(
    userId: string,
    schoolId: string,
    eventTitle: string,
    message: string
  ): Promise<string> {
    return this.createNotification({
      userId,
      schoolId,
      type: 'event-update',
      title: `Update: ${eventTitle}`,
      message,
      status: 'read',
    });
  }

  /**
   * Bulk create notifications for all teachers in a school
   */
  async broadcastNotification(
    schoolId: string,
    teacherIds: string[],
    notification: Omit<NotificationData, 'userId' | 'schoolId'>
  ): Promise<void> {
    try {
      const batch: Promise<string>[] = teacherIds.map((userId) =>
        this.createNotification({
          ...notification,
          userId,
          schoolId,
        })
      );

      await Promise.all(batch);
    } catch (error) {
      console.error('Error broadcasting notification:', error);
      throw error;
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
