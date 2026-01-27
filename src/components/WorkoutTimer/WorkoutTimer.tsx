import React, { useState, useEffect, useCallback } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { motion, AnimatePresence } from 'framer-motion';
import { playOutline, pauseOutline, refreshOutline, checkmarkOutline } from 'ionicons/icons';
import ProgressRing from '../ProgressRing';
import './WorkoutTimer.css';

interface WorkoutTimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  autoStart?: boolean;
  exerciseName?: string;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  duration,
  onComplete,
  autoStart = false,
  exerciseName,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isCompleted, setIsCompleted] = useState(false);

  const progress = ((duration - timeRemaining) / duration) * 100;

  useEffect(() => {
    setTimeRemaining(duration);
    setIsCompleted(false);
    setIsRunning(autoStart);
  }, [duration, autoStart]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining, onComplete]);

  const toggleTimer = useCallback(() => {
    if (isCompleted) return;
    setIsRunning((prev) => !prev);
  }, [isCompleted]);

  const resetTimer = useCallback(() => {
    setTimeRemaining(duration);
    setIsRunning(false);
    setIsCompleted(false);
  }, [duration]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="workout-timer">
      <ProgressRing
        progress={progress}
        size={200}
        strokeWidth={12}
        color={isCompleted ? 'var(--ion-color-success)' : 'var(--ion-color-primary)'}
      >
        <AnimatePresence mode="wait">
          {isCompleted ? (
            <motion.div
              key="completed"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="timer-completed"
            >
              <IonIcon icon={checkmarkOutline} />
              <span>Done!</span>
            </motion.div>
          ) : (
            <motion.div
              key="timer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="timer-display"
            >
              <span className="timer-time">{formatTime(timeRemaining)}</span>
              {exerciseName && (
                <span className="timer-exercise-name">{exerciseName}</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </ProgressRing>

      <div className="timer-controls">
        <IonButton
          fill="clear"
          onClick={resetTimer}
          disabled={timeRemaining === duration && !isRunning}
        >
          <IonIcon slot="icon-only" icon={refreshOutline} />
        </IonButton>

        <IonButton
          className="play-pause-button"
          onClick={toggleTimer}
          disabled={isCompleted}
          color={isRunning ? 'medium' : 'primary'}
        >
          <IonIcon slot="icon-only" icon={isRunning ? pauseOutline : playOutline} />
        </IonButton>

        <IonButton
          fill="clear"
          onClick={() => {
            setIsCompleted(true);
            setIsRunning(false);
            onComplete?.();
          }}
          disabled={isCompleted}
          color="success"
        >
          <IonIcon slot="icon-only" icon={checkmarkOutline} />
        </IonButton>
      </div>
    </div>
  );
};

export default WorkoutTimer;

