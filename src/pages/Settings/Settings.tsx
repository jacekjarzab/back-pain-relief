import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonIcon,
  IonItemDivider,
  IonNote,
  IonDatetime,
  IonModal,
  IonButton,
  IonButtons,
  useIonToast,
  useIonAlert,
} from '@ionic/react';
import {
  fitnessOutline,
  timerOutline,
  bodyOutline,
  volumeHighOutline,
  phonePortraitOutline,
  refreshOutline,
  notificationsOutline,
  timeOutline,
  trashOutline,
  warningOutline,
} from 'ionicons/icons';

import { useApp } from '../../context/AppContext';
import { Difficulty, BodyArea } from '../../models/types';
import { notificationService } from '../../services/notifications';
import './Settings.css';

const Settings: React.FC = () => {
  const { preferences, updatePreferences, refreshRoutine, resetProgress, progress } = useApp();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState(preferences.reminderTime || '09:00');
  const [presentToast] = useIonToast();
  const [presentAlert] = useIonAlert();

  // Format time for display
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Handle reminder toggle
  const handleReminderToggle = async (enabled: boolean) => {
    if (enabled) {
      const hasPermission = await notificationService.requestPermission();
      if (!hasPermission) {
        presentToast({
          message: 'Please enable notifications in your device settings',
          duration: 3000,
          color: 'warning',
        });
        return;
      }

      const time = preferences.reminderTime || '09:00';
      await notificationService.scheduleDailyReminder(time);
      await updatePreferences({ reminderEnabled: true, reminderTime: time });

      presentToast({
        message: `Daily reminder set for ${formatTime(time)}`,
        duration: 2000,
        color: 'success',
      });
    } else {
      await notificationService.cancelDailyReminder();
      await updatePreferences({ reminderEnabled: false });

      presentToast({
        message: 'Daily reminder disabled',
        duration: 2000,
        color: 'medium',
      });
    }
  };

  // Handle time selection
  const handleTimeConfirm = async () => {
    setShowTimePicker(false);

    if (preferences.reminderEnabled) {
      await notificationService.scheduleDailyReminder(tempTime);
    }

    await updatePreferences({ reminderTime: tempTime });

    if (preferences.reminderEnabled) {
      presentToast({
        message: `Reminder updated to ${formatTime(tempTime)}`,
        duration: 2000,
        color: 'success',
      });
    }
  };

  // Handle delete progress confirmation
  const handleDeleteProgress = () => {
    presentAlert({
      header: 'Delete Progress History',
      subHeader: 'This action cannot be undone',
      message: `Are you sure you want to delete all your progress? This will reset your ${progress.currentStreak}-day streak, ${progress.totalWorkoutsCompleted} completed workouts, and all history.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await resetProgress();
            presentToast({
              message: 'Progress history deleted',
              duration: 2000,
              color: 'warning',
              icon: trashOutline,
            });
          },
        },
      ],
    });
  };

  const handleDifficultyChange = (value: Difficulty) => {
    updatePreferences({ difficulty: value });
    refreshRoutine();
  };

  const handleDurationChange = (value: 'short' | 'medium' | 'long') => {
    updatePreferences({ workoutDuration: value });
    refreshRoutine();
  };

  const handleFocusAreasChange = (values: BodyArea[]) => {
    if (values.length > 0) {
      updatePreferences({ focusAreas: values });
      refreshRoutine();
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="settings-content">
          {/* Workout Preferences */}
          <IonItemDivider className="settings-divider">
            <IonLabel>Workout Preferences</IonLabel>
          </IonItemDivider>

          <IonList className="settings-list">
            <IonItem>
              <IonIcon icon={fitnessOutline} slot="start" color="primary" />
              <IonLabel>
                <h2>Difficulty Level</h2>
                <p>Adjust to your fitness level</p>
              </IonLabel>
              <IonSelect
                value={preferences.difficulty}
                onIonChange={(e) => handleDifficultyChange(e.detail.value)}
                interface="action-sheet"
              >
                <IonSelectOption value="beginner">Beginner</IonSelectOption>
                <IonSelectOption value="intermediate">Intermediate</IonSelectOption>
                <IonSelectOption value="advanced">Advanced</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonIcon icon={timerOutline} slot="start" color="primary" />
              <IonLabel>
                <h2>Workout Duration</h2>
                <p>How long is each session</p>
              </IonLabel>
              <IonSelect
                value={preferences.workoutDuration}
                onIonChange={(e) => handleDurationChange(e.detail.value)}
                interface="action-sheet"
              >
                <IonSelectOption value="short">Short (~10 min)</IonSelectOption>
                <IonSelectOption value="medium">Medium (~15 min)</IonSelectOption>
                <IonSelectOption value="long">Long (~20 min)</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonIcon icon={bodyOutline} slot="start" color="primary" />
              <IonLabel>
                <h2>Focus Areas</h2>
                <p>Which areas to target</p>
              </IonLabel>
              <IonSelect
                value={preferences.focusAreas}
                onIonChange={(e) => handleFocusAreasChange(e.detail.value)}
                multiple
                interface="alert"
              >
                <IonSelectOption value="upper-back">Upper Back</IonSelectOption>
                <IonSelectOption value="lower-back">Lower Back</IonSelectOption>
                <IonSelectOption value="core">Core</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>

          {/* Notification Preferences */}
          <IonItemDivider className="settings-divider">
            <IonLabel>Reminders</IonLabel>
          </IonItemDivider>

          <IonList className="settings-list">
            <IonItem>
              <IonIcon icon={notificationsOutline} slot="start" color="primary" />
              <IonLabel>
                <h2>Daily Reminder</h2>
                <p>Get notified to do your workout</p>
              </IonLabel>
              <IonToggle
                checked={preferences.reminderEnabled}
                onIonChange={(e) => handleReminderToggle(e.detail.checked)}
              />
            </IonItem>

            {preferences.reminderEnabled && (
              <IonItem button onClick={() => setShowTimePicker(true)}>
                <IonIcon icon={timeOutline} slot="start" color="primary" />
                <IonLabel>
                  <h2>Reminder Time</h2>
                  <p>When to remind you</p>
                </IonLabel>
                <IonNote slot="end" className="reminder-time">
                  {formatTime(preferences.reminderTime || '09:00')}
                </IonNote>
              </IonItem>
            )}
          </IonList>

          {/* App Preferences */}
          <IonItemDivider className="settings-divider">
            <IonLabel>App Preferences</IonLabel>
          </IonItemDivider>

          <IonList className="settings-list">
            <IonItem>
              <IonIcon icon={volumeHighOutline} slot="start" color="primary" />
              <IonLabel>
                <h2>Sound Effects</h2>
                <p>Play sounds during workout</p>
              </IonLabel>
              <IonToggle
                checked={preferences.soundEnabled}
                onIonChange={(e) => updatePreferences({ soundEnabled: e.detail.checked })}
              />
            </IonItem>

            <IonItem>
              <IonIcon icon={phonePortraitOutline} slot="start" color="primary" />
              <IonLabel>
                <h2>Haptic Feedback</h2>
                <p>Vibrate on actions</p>
              </IonLabel>
              <IonToggle
                checked={preferences.hapticEnabled}
                onIonChange={(e) => updatePreferences({ hapticEnabled: e.detail.checked })}
              />
            </IonItem>
          </IonList>

          {/* Regenerate Routine Note */}
          <div className="settings-note">
            <IonIcon icon={refreshOutline} />
            <IonNote>
              Changing workout preferences will regenerate today's routine.
            </IonNote>
          </div>

          {/* Data Management */}
          <IonItemDivider className="settings-divider">
            <IonLabel>Data Management</IonLabel>
          </IonItemDivider>

          <IonList className="settings-list">
            <IonItem button onClick={handleDeleteProgress} className="delete-progress-item">
              <IonIcon icon={trashOutline} slot="start" color="danger" />
              <IonLabel>
                <h2>Delete Progress History</h2>
                <p>Reset streak, workouts, and all history</p>
              </IonLabel>
            </IonItem>
          </IonList>

          {/* Delete Warning Note */}
          <div className="settings-warning">
            <IonIcon icon={warningOutline} />
            <IonNote>
              Deleting your progress cannot be undone. Your preferences will be preserved.
            </IonNote>
          </div>
        </div>

        {/* Time Picker Modal */}
        <IonModal
          isOpen={showTimePicker}
          onDidDismiss={() => setShowTimePicker(false)}
          className="time-picker-modal"
        >
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => setShowTimePicker(false)}>Cancel</IonButton>
              </IonButtons>
              <IonTitle>Reminder Time</IonTitle>
              <IonButtons slot="end">
                <IonButton strong onClick={handleTimeConfirm}>Done</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <div className="time-picker-content">
              <p className="time-picker-description">
                Choose when you'd like to receive your daily workout reminder.
              </p>
              <IonDatetime
                presentation="time"
                value={`2024-01-01T${tempTime}:00`}
                onIonChange={(e) => {
                  const value = e.detail.value as string;
                  if (value) {
                    const time = value.split('T')[1]?.substring(0, 5) || tempTime;
                    setTempTime(time);
                  }
                }}
                className="reminder-datetime"
              />
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Settings;

