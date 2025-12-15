import React from 'react';
import { motion } from 'framer-motion';
import './ProgressRing.css';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  showPercentage?: boolean;
  animated?: boolean;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = 'var(--ion-color-primary)',
  backgroundColor = 'var(--ion-color-light-shade)',
  children,
  showPercentage = false,
  animated = true,
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <div className="progress-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="progress-ring-svg">
        {/* Background circle */}
        <circle
          className="progress-ring-background"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <motion.circle
          className="progress-ring-progress"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            transformOrigin: '50% 50%',
            transform: 'rotate(-90deg)',
          }}
          initial={animated ? { strokeDashoffset: circumference } : false}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      
      <div className="progress-ring-content">
        {children ? (
          children
        ) : showPercentage ? (
          <motion.span 
            className="progress-ring-percentage"
            initial={animated ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {Math.round(normalizedProgress)}%
          </motion.span>
        ) : null}
      </div>
    </div>
  );
};

export default ProgressRing;

