import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonChip,
  IonList,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  chevronBackOutline,
  checkmarkCircleOutline,
  timeOutline,
  fitnessOutline,
  bulbOutline,
  listOutline,
  heartOutline,
  videocamOutline,
  imageOutline,
} from 'ionicons/icons';

import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import CloudSyncBadge from '../../components/CloudSyncBadge';
import { useTranslatedExercise } from '../../hooks/useTranslatedExercises';
import './ExerciseDetail.css';

const ExerciseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { t } = useTranslation();
  const { todayRoutine, completeExercise } = useApp();
  const [viewMode, setViewMode] = useState<'image' | 'video'>('image');

  const exercise = useTranslatedExercise(id);
  const workoutExercise = todayRoutine?.exercises.find(we => we.exercise.id === id);
  const isCompleted = workoutExercise?.completed ?? false;

  if (!exercise) {
    return (
      <IonPage>
        <IonContent className="exercise-not-found">
          <p>{t('workout.exercise')} {t('common.error').toLowerCase()}</p>
          <IonButton onClick={() => history.goBack()}>{t('common.back')}</IonButton>
        </IonContent>
      </IonPage>
    );
  }

  const handleComplete = async () => {
    await completeExercise(exercise.id);
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'medium';
    }
  };

  const formatDuration = (seconds: number): string => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    }
    return `${seconds}s`;
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" icon={chevronBackOutline} text="" />
          </IonButtons>
          <IonButtons slot="end">
            <CloudSyncBadge />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <motion.div
          className="exercise-detail"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Media Section with Toggle */}
          <div className="detail-media-container">
            {exercise.videoUrl && (
              <IonSegment
                value={viewMode}
                onIonChange={(e) => setViewMode(e.detail.value as 'image' | 'video')}
                className="media-toggle"
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
                  className="detail-image-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <img src={exercise.imageUrl} alt={exercise.name} />
                </motion.div>
              ) : (
                <motion.div
                  key="video"
                  className="detail-video-container"
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

            {isCompleted && (
              <motion.div
                className="completed-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <IonIcon icon={checkmarkCircleOutline} />
                {t('workout.completed')}
              </motion.div>
            )}
          </div>

          {/* Exercise Header */}
          <div className="detail-header">
            <h1>{exercise.name}</h1>
            <p className="detail-description">{exercise.description}</p>

            <div className="detail-chips">
              <IonChip color={getDifficultyColor(exercise.difficulty)}>
                <IonIcon icon={fitnessOutline} />{t(`exercises.difficulty.${exercise.difficulty}`)}
              </IonChip>
              <IonChip color="medium">
                <IonIcon icon={timeOutline} />{formatDuration(exercise.durationSeconds)}
              </IonChip>
              <IonChip color="primary" outline>
                {t(`exercises.bodyArea.${exercise.bodyArea}`)}
              </IonChip>
            </div>
          </div>

          {/* Instructions */}
          <section className="detail-section">
            <div className="section-title">
              <IonIcon icon={listOutline} />
              <h3>{t('exercises.instructions')}</h3>
            </div>
            <IonList className="instructions-list">
              {exercise.instructions.map((instruction, index) => (
                <IonItem key={index} lines="none" className="instruction-item">
                  <div className="instruction-number">{index + 1}</div>
                  <IonLabel className="ion-text-wrap">{instruction}</IonLabel>
                </IonItem>
              ))}
            </IonList>
          </section>

          {/* Pro Tips */}
          <section className="detail-section">
            <div className="section-title">
              <IonIcon icon={bulbOutline} />
              <h3>{t('exercises.proTips')}</h3>
            </div>
            <ul className="tips-list">
              {exercise.proTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </section>

          {/* Benefits */}
          <section className="detail-section">
            <div className="section-title">
              <IonIcon icon={heartOutline} />
              <h3>{t('exercises.benefits')}</h3>
            </div>
            <div className="benefits-list">
              {exercise.benefits.map((benefit, index) => (
                <IonChip key={index} color="primary" outline className="benefit-chip">
                  {benefit}
                </IonChip>
              ))}
            </div>
          </section>

          {/* Complete Button */}
          {workoutExercise && !isCompleted && (
            <div className="detail-actions">
              <IonButton expand="block" onClick={handleComplete} color="success">
                <IonIcon slot="start" icon={checkmarkCircleOutline} />{t('workout.complete')}
              </IonButton>
            </div>
          )}
        </motion.div>
      </IonContent>
    </IonPage>
  );
};

export default ExerciseDetail;
