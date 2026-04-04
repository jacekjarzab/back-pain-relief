import { LocalNotifications, ScheduleOptions, PendingResult } from '@capacitor/local-notifications';
import { Capacitor, type PluginListenerHandle } from '@capacitor/core';

// Notification IDs
const DAILY_REMINDER_ID = 1;

// Motivational messages for variety
const reminderMessages = [
  { title: "Time for Your Back!", body: "A few minutes now saves hours of pain later. Let's go! 💪" },
  { title: "Your Spine Awaits!", body: "Ready to strengthen your back today? Tap to start!" },
  { title: "Daily Back Care", body: "Consistency is key! Your back workout is ready." },
  { title: "Feeling Stiff?", body: "A quick stretch can work wonders. Start your routine!" },
  { title: "Back Pain Prevention", body: "Take 10 minutes for a healthier spine today." },
  { title: "Posture Check!", body: "Time to strengthen those back muscles. Let's begin!" },
  { title: "Your Back Thanks You", body: "Each workout is an investment in a pain-free future." },
];

class NotificationService {
  private get isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  private get isAvailable(): boolean {
    // Check if we're on a real native platform (iOS/Android)
    const platform = Capacitor.getPlatform();
    return platform === 'ios' || platform === 'android';
  }

  /**
   * Request permission to show notifications
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isAvailable) {
      console.log('Notifications not available on web - simulating success');
      return true; // Return true on web so UI can proceed
    }

    try {
      const permission = await LocalNotifications.requestPermissions();
      return permission.display === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  /**
   * Check if notifications are enabled
   */
  async checkPermission(): Promise<boolean> {
    if (!this.isAvailable) {
      return true; // Return true on web so UI can proceed
    }

    try {
      const permission = await LocalNotifications.checkPermissions();
      return permission.display === 'granted';
    } catch (error) {
      console.error('Failed to check notification permission:', error);
      return false;
    }
  }

  /**
   * Schedule daily reminder notification
   * @param time - Time in HH:mm format (e.g., "09:00")
   */
  async scheduleDailyReminder(time: string): Promise<boolean> {
    if (!this.isAvailable) {
      console.log(`[Web] Reminder would be scheduled for ${time} on a real device`);
      return true; // Return true on web so UI can proceed
    }

    try {
      // Cancel any existing reminder first
      await this.cancelDailyReminder();

      const [hours, minutes] = time.split(':').map(Number);

      // Get a random message
      const message = reminderMessages[Math.floor(Math.random() * reminderMessages.length)];

      // Create schedule date for today or tomorrow
      const now = new Date();
      const scheduleDate = new Date();
      scheduleDate.setHours(hours, minutes, 0, 0);

      // If the time has already passed today, schedule for tomorrow
      if (scheduleDate <= now) {
        scheduleDate.setDate(scheduleDate.getDate() + 1);
      }

      const options: ScheduleOptions = {
        notifications: [
          {
            id: DAILY_REMINDER_ID,
            title: message.title,
            body: message.body,
            schedule: {
              at: scheduleDate,
              repeats: true,
              every: 'day',
              allowWhileIdle: true,
            },
            sound: 'default',
            smallIcon: 'ic_stat_fitness',
            largeIcon: 'ic_launcher',
            actionTypeId: 'OPEN_WORKOUT',
          },
        ],
      };

      await LocalNotifications.schedule(options);
      console.log('Daily reminder scheduled for:', time);
      return true;
    } catch (error) {
      console.error('Failed to schedule daily reminder:', error);
      return false;
    }
  }

  /**
   * Cancel the daily reminder notification
   */
  async cancelDailyReminder(): Promise<void> {
    if (!this.isAvailable) {
      console.log('[Web] Reminder would be canceled on a real device');
      return;
    }

    try {
      await LocalNotifications.cancel({ notifications: [{ id: DAILY_REMINDER_ID }] });
      console.log('Daily reminder canceled');
    } catch (error) {
      console.error('Failed to cancel daily reminder:', error);
    }
  }

  /**
   * Get pending notifications
   */
  async getPendingNotifications(): Promise<PendingResult | null> {
    if (!this.isAvailable) {
      return null;
    }

    try {
      return await LocalNotifications.getPending();
    } catch (error) {
      console.error('Failed to get pending notifications:', error);
      return null;
    }
  }

  /**
   * Add listeners for notification events
   */
  async addListeners(onNotificationClick: () => void): Promise<PluginListenerHandle | null> {
    if (!this.isAvailable) {
      return null;
    }

    return LocalNotifications.addListener('localNotificationActionPerformed', () => {
      onNotificationClick();
    });
  }
}

export const notificationService = new NotificationService();

