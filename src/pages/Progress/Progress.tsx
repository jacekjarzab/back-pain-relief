import React, { useMemo } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonCard,
  IonCardContent,
  IonIcon,
  IonButtons,
} from '@ionic/react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { 
  flameOutline, 
  trophyOutline, 
  timeOutline, 
  checkmarkDoneOutline,
  calendarOutline,
} from 'ionicons/icons';

import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import StreakBadge from '../../components/StreakBadge';
import CloudSyncBadge from '../../components/CloudSyncBadge';
import './Progress.css';

const Progress: React.FC = () => {
  const { t } = useTranslation();
  const { progress } = useApp();

  // Generate calendar data for current month
  const calendarData = useMemo(() => {
    const today = dayjs();
    const startOfMonth = today.startOf('month');
    const endOfMonth = today.endOf('month');
    const startDay = startOfMonth.day(); // 0-6 (Sun-Sat)
    
    const days: { date: dayjs.Dayjs; isCompleted: boolean; isToday: boolean; isCurrentMonth: boolean }[] = [];
    
    // Add padding for days before month starts
    for (let i = 0; i < startDay; i++) {
      const date = startOfMonth.subtract(startDay - i, 'day');
      days.push({ 
        date, 
        isCompleted: false, 
        isToday: false, 
        isCurrentMonth: false 
      });
    }
    
    // Add days of the month
    let current = startOfMonth;
    while (current.isBefore(endOfMonth) || current.isSame(endOfMonth, 'day')) {
      const dateStr = current.format('YYYY-MM-DD');
      days.push({
        date: current,
        isCompleted: progress.completedDates.includes(dateStr),
        isToday: current.isSame(today, 'day'),
        isCurrentMonth: true,
      });
      current = current.add(1, 'day');
    }
    
    // Fill remaining cells to complete the grid
    while (days.length % 7 !== 0) {
      days.push({
        date: current,
        isCompleted: false,
        isToday: false,
        isCurrentMonth: false,
      });
      current = current.add(1, 'day');
    }
    
    return days;
  }, [progress.completedDates]);

  const stats = [
    {
      icon: flameOutline,
      value: progress.longestStreak,
      label: t('progress.weeklyGoal'), // Best Streak
      color: 'secondary'
    },
    {
      icon: checkmarkDoneOutline,
      value: progress.totalWorkoutsCompleted,
      label: t('progress.workoutsCompleted'),
      color: 'success'
    },
    {
      icon: trophyOutline,
      value: progress.totalExercisesCompleted,
      label: t('progress.streak'), // Exercises (using streak as it's similar)
      color: 'primary'
    },
    {
      icon: timeOutline,
      value: progress.totalMinutesExercised,
      label: t('progress.totalTime'),
      color: 'warning'
    },
  ];

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>{t('progress.title')}</IonTitle>
          <IonButtons slot="end">
            <CloudSyncBadge />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{t('progress.title')}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="progress-content">
          {/* Current Streak */}
          <motion.section 
            className="streak-section"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>{t('progress.streak')}</h3>
            <StreakBadge streak={progress.currentStreak} size="large" />
          </motion.section>

          {/* Stats Grid */}
          <section className="stats-section">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <IonCard className="stat-card">
                    <IonCardContent>
                      <IonIcon 
                        icon={stat.icon} 
                        className={`stat-icon color-${stat.color}`} 
                      />
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </IonCardContent>
                  </IonCard>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Calendar */}
          <section className="calendar-section">
            <div className="section-header">
              <IonIcon icon={calendarOutline} />
              <h3>{dayjs().format('MMMM YYYY')}</h3>
            </div>
            
            <div className="calendar">
              <div className="calendar-header">
                {[
                  t('progress.days.sun'),
                  t('progress.days.mon'),
                  t('progress.days.tue'),
                  t('progress.days.wed'),
                  t('progress.days.thu'),
                  t('progress.days.fri'),
                  t('progress.days.sat')
                ].map(day => (
                  <div key={day} className="calendar-day-name">{day}</div>
                ))}
              </div>
              
              <div className="calendar-grid">
                {calendarData.map((day, index) => (
                  <div
                    key={index}
                    className={`calendar-day 
                      ${day.isCurrentMonth ? '' : 'other-month'}
                      ${day.isToday ? 'today' : ''}
                      ${day.isCompleted ? 'completed' : ''}
                    `}
                  >
                    <span>{day.date.date()}</span>
                    {day.isCompleted && <div className="completed-dot" />}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Progress;
