import React from 'react';
import { motion } from 'framer-motion';
import { IonIcon } from '@ionic/react';
import { flameOutline, flame } from 'ionicons/icons';
import './StreakBadge.css';

interface StreakBadgeProps {
  streak: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  animated?: boolean;
}

const StreakBadge: React.FC<StreakBadgeProps> = ({
  streak,
  size = 'medium',
  showLabel = true,
  animated = true,
}) => {
  const isActive = streak > 0;

  const Wrapper = animated ? motion.div : 'div';
  const wrapperProps = animated ? {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: 'spring', stiffness: 300 }
  } : {};

  return (
    <Wrapper className={`streak-badge streak-badge-${size} ${isActive ? 'active' : ''}`} {...wrapperProps}>
      <div className="streak-icon-container">
        <IonIcon icon={isActive ? flame : flameOutline} className="streak-icon" />
        {isActive && animated && (
          <motion.div
            className="streak-glow"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>
      
      <div className="streak-info">
        <span className="streak-count">{streak}</span>
        {showLabel && (
          <span className="streak-label">
            {streak === 1 ? 'day' : 'days'}
          </span>
        )}
      </div>
    </Wrapper>
  );
};

export default StreakBadge;

