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
  settingsOutline,
} from 'ionicons/icons';

import { useApp } from '../../context/AppContext';
import { Difficulty, BodyArea } from '../../models/types';
import { notificationService } from '../../services/notifications';
import { useTranslation } from 'react-i18next';
import './Settings.css';

const Settings: React.FC = () => {
  const { preferences, updatePreferences, refreshRoutine, resetProgress, progress } = useApp();
  const { t } = useTranslation();
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
          message: t('settings.enableNotifications'),
          duration: 3000,
          color: 'warning',
        });
        return;
      }

      const time = preferences.reminderTime || '09:00';
      await notificationService.scheduleDailyReminder(time);
      await updatePreferences({ reminderEnabled: true, reminderTime: time });

      presentToast({
        message: t('settings.reminderSet', { time: formatTime(time) }),
        duration: 2000,
        color: 'success',
      });
    } else {
      await notificationService.cancelDailyReminder();
      await updatePreferences({ reminderEnabled: false });

      presentToast({
        message: t('settings.reminderDisabled'),
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
        message: t('settings.reminderUpdated', { time: formatTime(tempTime) }),
        duration: 2000,
        color: 'success',
      });
    }
  };

  // Handle delete progress confirmation
  const handleDeleteProgress = () => {
    presentAlert({
      header: t('settings.deleteProgressHeader'),
      subHeader: t('settings.deleteProgressSubHeader'),
      message: t('settings.deleteProgressMessage', {
        streak: progress.currentStreak,
        workouts: progress.totalWorkoutsCompleted
      }),
      buttons: [
        {
          text: t('common.cancel'),
          role: 'cancel',
        },
        {
          text: t('settings.delete'),
          role: 'destructive',
          handler: async () => {
            await resetProgress();
            presentToast({
              message: t('settings.progressDeleted'),
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
            <IonTitle>{t('settings.title')}</IonTitle>
          </IonToolbar>
        </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{t('settings.title')}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="settings-content">
          {/* Workout Preferences */}
          <IonItemDivider className="settings-divider">
            <IonLabel>{t('settings.workoutPreferences')}</IonLabel>
          </IonItemDivider>

          <IonList className="settings-list">
            <IonItem>
              <IonIcon icon={fitnessOutline} slot="start" color="primary" />
              <IonLabel>
                <h2>{t('settings.difficultyLevel')}</h2>
                <p>{t('settings.difficultyDescription')}</p>
              </IonLabel>
              <IonSelect
                value={preferences.difficulty}
                onIonChange={(e) => handleDifficultyChange(e.detail.value)}
                interface="action-sheet"
              >
                <IonSelectOption value="beginner">{t('settings.beginner')}</IonSelectOption>
                <IonSelectOption value="intermediate">{t('settings.intermediate')}</IonSelectOption>
                <IonSelectOption value="advanced">{t('settings.advanced')}</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonIcon icon={timerOutline} slot="start" color="primary" />
              <IonLabel>
                <h2>{t('settings.workoutDuration')}</h2>
                <p>{t('settings.durationDescription')}</p>
              </IonLabel>
              <IonSelect
                value={preferences.workoutDuration}
                onIonChange={(e) => handleDurationChange(e.detail.value)}
                interface="action-sheet"
              >
                <IonSelectOption value="short">{t('settings.short')}</IonSelectOption>
                <IonSelectOption value="medium">{t('settings.medium')}</IonSelectOption>
                <IonSelectOption value="long">{t('settings.long')}</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonIcon icon={bodyOutline} slot="start" color="primary" />
              <IonLabel>
                <h2>{t('settings.focusAreas')}</h2>
                <p>{t('settings.focusAreasDescription')}</p>
              </IonLabel>
              <IonSelect
                value={preferences.focusAreas}
                onIonChange={(e) => handleFocusAreasChange(e.detail.value)}
                multiple
                interface="alert"
              >
                <IonSelectOption value="upper-back">{t('settings.upperBack')}</IonSelectOption>
                <IonSelectOption value="lower-back">{t('settings.lowerBack')}</IonSelectOption>
                <IonSelectOption value="core">{t('settings.core')}</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>

          {/* Notification Preferences */}
          <IonItemDivider className="settings-divider">
            <IonLabel>{t('settings.reminders')}</IonLabel>
          </IonItemDivider>

          <IonList className="settings-list">
            <IonItem>
              <IonIcon icon={notificationsOutline} slot="start" color="primary" />
              <IonLabel>
                <h2>{t('settings.dailyReminder')}</h2>
                <p>{t('settings.reminderDescription')}</p>
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
                  <h2>{t('settings.reminderTime')}</h2>
                  <p>{t('settings.reminderTimeDescription')}</p>
                </IonLabel>
                <IonNote slot="end" className="reminder-time">
                  {formatTime(preferences.reminderTime || '09:00')}
                </IonNote>
              </IonItem>
            )}
          </IonList>

          {/* App Preferences */}
          <IonItemDivider className="settings-divider">
            <IonLabel>{t('settings.appPreferences')}</IonLabel>
          </IonItemDivider>

          <IonList className="settings-list">
            <IonItem>
              <IonIcon icon={volumeHighOutline} slot="start" color="primary" />
              <IonLabel>
                <h2>{t('settings.soundEffects')}</h2>
                <p>{t('settings.soundDescription')}</p>
              </IonLabel>
              <IonToggle
                checked={preferences.soundEnabled}
                onIonChange={(e) => updatePreferences({ soundEnabled: e.detail.checked })}
              />
            </IonItem>

            <IonItem>
              <IonIcon icon={phonePortraitOutline} slot="start" color="primary" />
              <IonLabel>
                <h2>{t('settings.hapticFeedback')}</h2>
                <p>{t('settings.hapticDescription')}</p>
              </IonLabel>
              <IonToggle
                checked={preferences.hapticEnabled}
                onIonChange={(e) => updatePreferences({ hapticEnabled: e.detail.checked })}
              />
            </IonItem>

            <IonItem>
              <IonIcon icon={settingsOutline} slot="start" color="primary" />
              <IonLabel>
                <h2>{t('settings.language')}</h2>
                <p>{t('settings.languageDescription')}</p>
              </IonLabel>
              <IonSelect
                value={preferences.language}
                onIonChange={(e) => updatePreferences({ language: e.detail.value })}
                interface="action-sheet"
              >
                <IonSelectOption value="en">{t('settings.english')}</IonSelectOption>
                <IonSelectOption value="pl">{t('settings.polish')}</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>

          {/* Regenerate Routine Note */}
          <div className="settings-note">
            <IonIcon icon={refreshOutline} />
            <IonNote>
              {t('settings.regenerateNote')}
            </IonNote>
          </div>

          {/* Data Management */}
          <IonItemDivider className="settings-divider">
            <IonLabel>{t('settings.dataManagement')}</IonLabel>
          </IonItemDivider>

          <IonList className="settings-list">
            <IonItem button onClick={handleDeleteProgress} className="delete-progress-item">
              <IonIcon icon={trashOutline} slot="start" color="danger" />
              <IonLabel>
                <h2>{t('settings.deleteProgressHistory')}</h2>
                <p>{t('settings.deleteProgressDescription')}</p>
              </IonLabel>
            </IonItem>
          </IonList>

          {/* Delete Warning Note */}
          <div className="settings-warning">
            <IonIcon icon={warningOutline} />
            <IonNote>
              {t('settings.deleteProgressWarning')}
            </IonNote>
          </div>
        </div>

        {/* Time Picker Modal */}
        <IonModal
          isOpen={showTimePicker}
          onDidDismiss={() => setShowTimePicker(false)}
          initialBreakpoint={0.5}
          breakpoints={[0, 0.5]}
          className="time-picker-modal"
        >
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => setShowTimePicker(false)}>{t('common.cancel')}</IonButton>
              </IonButtons>
              <IonTitle>{t('settings.reminderTimeTitle')}</IonTitle>
              <IonButtons slot="end">
                <IonButton strong onClick={handleTimeConfirm}>{t('common.confirm')}</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
            <IonContent className="ion-padding">
              <div className="time-picker-content">
                <p className="time-picker-description">
                  {t('settings.reminderTimeDescription')}
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

