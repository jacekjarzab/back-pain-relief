import React, { useMemo } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { playCircleOutline, refreshOutline } from 'ionicons/icons';

import { useApp } from '../../context/AppContext';
import { getRandomProTip } from '../../data/exercises';
import ProgressRing from '../../components/ProgressRing';
import StreakBadge from '../../components/StreakBadge';
import ExerciseCard from '../../components/ExerciseCard';
import ProTipCard from '../../components/ProTipCard';

import './Dashboard.css';

const Dashboard: React.FC = () => {
  const history = useHistory();
  const { todayRoutine, progress, isLoading, refreshRoutine, completeExercise } = useApp();

  const dailyTip = useMemo(() => getRandomProTip(), []);

  const completedCount = todayRoutine?.exercises.filter(e => e.completed).length ?? 0;
  const totalCount = todayRoutine?.exercises.length ?? 0;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isWorkoutComplete = todayRoutine?.completed ?? false;

  const formatDuration = (seconds: number): string => {
    const mins = Math.round(seconds / 60);
    return `${mins} min`;
  };

  if (isLoading) {
    return (
      <IonPage>
        <IonContent className="dashboard-loading">
          <IonSpinner name="crescent" />
          <p>Preparing your workout...</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>Back Pain Relief</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              {dayjs().format('dddd')}
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="dashboard-content">
          {/* Hero Section with Progress */}
          <motion.section 
            className="hero-section"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="hero-stats">
              <ProgressRing 
                progress={completionPercentage} 
                size={140}
                strokeWidth={10}
                color={isWorkoutComplete ? 'var(--ion-color-success)' : 'var(--ion-color-primary)'}
              >
                <div className="progress-inner">
                  <span className="progress-count">{completedCount}/{totalCount}</span>
                  <span className="progress-label">exercises</span>
                </div>
              </ProgressRing>

              <div className="hero-info">
                <h2 className="hero-greeting">
                  {isWorkoutComplete ? "Great job! 🎉" : "Today's Workout"}
                </h2>
                <p className="hero-subtitle">
                  {isWorkoutComplete 
                    ? "You completed today's routine!"
                    : `${formatDuration(todayRoutine?.totalDuration ?? 0)} • ${totalCount} exercises`
                  }
                </p>
                <StreakBadge streak={progress.currentStreak} size="small" />
              </div>
            </div>

            {!isWorkoutComplete && (
              <IonButton 
                expand="block" 
                className="start-workout-button"
                onClick={() => history.push('/workout')}
              >
                <IonIcon slot="start" icon={playCircleOutline} />
                {completedCount > 0 ? 'Continue Workout' : 'Start Workout'}
              </IonButton>
            )}
          </motion.section>

          {/* Daily Pro Tip */}
          <section className="tip-section">
            <ProTipCard tip={dailyTip} />
          </section>

          {/* Exercise Preview */}
          <section className="exercises-section">
            <div className="section-header">
              <h3>Today's Exercises</h3>
              <IonButton fill="clear" size="small" onClick={refreshRoutine}>
                <IonIcon slot="icon-only" icon={refreshOutline} />
              </IonButton>
            </div>

            <div className="exercises-list">
              {todayRoutine?.exercises.map((we, index) => (
                <ExerciseCard
                  key={we.exercise.id}
                  workoutExercise={we}
                  index={index}
                  onClick={() => history.push(`/exercise/${we.exercise.id}`)}
                  onComplete={() => completeExercise(we.exercise.id)}
                />
              ))}
            </div>
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;

