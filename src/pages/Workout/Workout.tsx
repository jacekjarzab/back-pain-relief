import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonChip,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  chevronBackOutline,
  chevronForwardOutline,
  checkmarkCircleOutline,
  informationCircleOutline,
  videocamOutline,
  imageOutline,
} from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import { useExerciseTranslation } from '../../hooks/useTranslatedExercises';
import WorkoutTimer from '../../components/WorkoutTimer';
import './Workout.css';

const Workout: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { todayRoutine, completeExercise, completeWorkout, preferences } = useApp();

  const [currentIndex, setCurrentIndex] = useState(() => {
    // Start from first incomplete exercise
    const firstIncomplete = todayRoutine?.exercises.findIndex(e => !e.completed) ?? 0;
    return Math.max(0, firstIncomplete);
  });
  const [viewMode, setViewMode] = useState<'image' | 'video'>('image');

  const currentExercise = todayRoutine?.exercises[currentIndex];
  const isLastExercise = currentIndex === (todayRoutine?.exercises.length ?? 0) - 1;
  const allCompleted = todayRoutine?.exercises.every(e => e.completed) ?? false;
  const { translateExercise } = useExerciseTranslation();

   const handleComplete = async () => {
    if (!currentExercise) return;

    // Haptic feedback
    if (preferences.hapticEnabled) {
      try {
        await Haptics.impact({ style: ImpactStyle.Medium });
      } catch {
        // Haptics not available on web
      }
    }

    await completeExercise(currentExercise.exercise.id);

    // Auto-advance if not last exercise
    if (!isLastExercise) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 500);
    }
  };

  const handleFinishWorkout = async () => {
    if (preferences.hapticEnabled) {
      try {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } catch {
        // Haptics not available
      }
    }
    await completeWorkout();
    history.push('/dashboard');
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleNext = () => {
    if (!isLastExercise) setCurrentIndex(prev => prev + 1);
  };

  if (!todayRoutine || !currentExercise) {
    return (
      <IonPage>
        <IonContent className="workout-empty">
          <p>{t('workout.title')} {t('common.error').toLowerCase()}</p>
          <IonButton onClick={() => history.push('/dashboard')}>
            {t('navigation.home')}
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  const exercise = translateExercise(currentExercise.exercise);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" icon={chevronBackOutline} text="" />
          </IonButtons>
          <IonTitle>
            {currentIndex + 1} / {todayRoutine.exercises.length}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={exercise.id}
            className="workout-content"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Exercise Media with Toggle */}
            <div className="exercise-image-hero">
              {exercise.videoUrl && (
                <IonSegment
                  value={viewMode}
                  onIonChange={(e) => setViewMode(e.detail.value as 'image' | 'video')}
                  className="workout-media-toggle"
                >
                  <IonSegmentButton value="image">
                    <IonIcon icon={imageOutline} />
                  </IonSegmentButton>
                  <IonSegmentButton value="video">
                    <IonIcon icon={videocamOutline} />
                  </IonSegmentButton>
                </IonSegment>
              )}

              <AnimatePresence mode="wait">
                {viewMode === 'image' ? (
                  <motion.div
                    key="image"
                    className="workout-media-image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <img src={exercise.imageUrl} alt={exercise.name} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="video"
                    className="workout-media-video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <iframe
                      src={exercise.videoUrl}
                      title={`${exercise.name} video tutorial`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="exercise-overlay">
                <IonChip color="light" className="exercise-area-chip">
                  {t(`exercises.bodyArea.${exercise.bodyArea}`)}
                </IonChip>
              </div>
            </div>

            {/* Exercise Info */}
            <div className="exercise-workout-info">
              <h1 className="exercise-title">{exercise.name}</h1>
              <p className="exercise-description">{exercise.description}</p>

              {/* Timer */}
              <WorkoutTimer
                duration={exercise.durationSeconds}
                exerciseName={exercise.name}
                onComplete={handleComplete}
              />

              {/* Quick Tip */}
              {exercise.proTips[0] && (
                <div className="quick-tip">
                  <IonIcon icon={informationCircleOutline} />
                  <span>{exercise.proTips[0]}</span>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Footer */}
        <div className="workout-navigation">
          <IonButton fill="clear" onClick={handlePrevious} disabled={currentIndex === 0}>
            <IonIcon slot="start" icon={chevronBackOutline} />
            {t('common.previous')}
          </IonButton>

          {allCompleted || isLastExercise ? (
            <IonButton color="success" onClick={handleFinishWorkout}>
              <IonIcon slot="start" icon={checkmarkCircleOutline} />
              {t('workout.finishWorkout')}
            </IonButton>
          ) : (
            <IonButton fill="clear" onClick={handleNext}>
              {t('common.next')}
              <IonIcon slot="end" icon={chevronForwardOutline} />
            </IonButton>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Workout;

