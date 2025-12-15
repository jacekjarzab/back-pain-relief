import React from 'react';
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
} from '@ionic/react';
import { 
  fitnessOutline, 
  timerOutline, 
  bodyOutline,
  volumeHighOutline,
  phonePortraitOutline,
  refreshOutline,
} from 'ionicons/icons';

import { useApp } from '../../context/AppContext';
import { Difficulty, BodyArea } from '../../models/types';
import './Settings.css';

const Settings: React.FC = () => {
  const { preferences, updatePreferences, refreshRoutine } = useApp();

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
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Settings;

