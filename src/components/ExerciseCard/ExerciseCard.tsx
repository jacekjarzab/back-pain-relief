import React from 'react';
import { IonCard, IonCardContent, IonIcon, IonChip, IonRippleEffect } from '@ionic/react';
import { motion } from 'framer-motion';
import { checkmarkCircle, timeOutline, fitnessOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { WorkoutExercise } from '../../models/types';
import { useExerciseTranslation } from '../../hooks/useTranslatedExercises';
import './ExerciseCard.css';

interface ExerciseCardProps {
  workoutExercise: WorkoutExercise;
  index: number;
  onClick?: () => void;
  onComplete?: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  workoutExercise,
  index,
  onClick,
  onComplete,
}) => {
  const { exercise: baseExercise, completed } = workoutExercise;
  const { translateExercise } = useExerciseTranslation();
  const exercise = translateExercise(baseExercise);

  const { t } = useTranslation();

  const formatDuration = (seconds: number): string => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    }
    return `${seconds}s`;
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'medium';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <IonCard
        className={`exercise-card ion-activatable ${completed ? 'completed' : ''}`}
        onClick={onClick}
        button
      >
        <IonRippleEffect />
        <div className="exercise-card-content">
          <div className="exercise-number">{index + 1}</div>

          <div className="exercise-image-container">
            <img
              src={exercise.imageUrl}
              alt={exercise.name}
              className="exercise-image"
            />
            {completed && (
              <motion.div
                className="completed-overlay"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <IonIcon icon={checkmarkCircle} />
              </motion.div>
            )}
          </div>

          <IonCardContent className="exercise-info">
            <h3 className="exercise-name">{exercise.name}</h3>

            <div className="exercise-meta">
              <IonChip color={getDifficultyColor(exercise.difficulty)} className="meta-chip">
                <IonIcon icon={fitnessOutline} />
                {t(`exercises.difficulty.${exercise.difficulty}`)}
              </IonChip>

              <IonChip color="medium" className="meta-chip">
                <IonIcon icon={timeOutline} />
                {formatDuration(exercise.durationSeconds)}
              </IonChip>
            </div>

            <p className="exercise-area ion-display-flex ion-justify-content-between">
              <span>{t(`exercises.bodyArea.${exercise.bodyArea}`)}</span>
              {!completed && onComplete && (
              <button
                className="complete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete();
                }}
              >
                <IonIcon icon={checkmarkCircle} />
              </button>
            )}
            </p>

          </IonCardContent>
        </div>
      </IonCard>
    </motion.div>
  );
};

export default ExerciseCard;

