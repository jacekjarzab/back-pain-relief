import React from 'react';
import { IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { motion } from 'framer-motion';
import { bulbOutline, bodyOutline, walkOutline, sparklesOutline } from 'ionicons/icons';
import { ProTip } from '../../models/types';
import './ProTipCard.css';

interface ProTipCardProps {
  tip: ProTip;
  animated?: boolean;
}

const ProTipCard: React.FC<ProTipCardProps> = ({ tip, animated = true }) => {
  const getCategoryIcon = (category: ProTip['category']) => {
    switch (category) {
      case 'posture': return bodyOutline;
      case 'lifestyle': return walkOutline;
      case 'exercise': return sparklesOutline;
      case 'motivation': return bulbOutline;
      default: return bulbOutline;
    }
  };

  const getCategoryColor = (category: ProTip['category']) => {
    switch (category) {
      case 'posture': return 'primary';
      case 'lifestyle': return 'tertiary';
      case 'exercise': return 'secondary';
      case 'motivation': return 'warning';
      default: return 'primary';
    }
  };

  const Wrapper = animated ? motion.div : 'div';
  const wrapperProps = animated ? {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 }
  } : {};

  return (
    <Wrapper {...wrapperProps}>
      <IonCard className="pro-tip-card">
        <IonCardContent>
          <div className="pro-tip-header">
            <div className={`pro-tip-icon icon-${getCategoryColor(tip.category)}`}>
              <IonIcon icon={getCategoryIcon(tip.category)} />
            </div>
            <div className="pro-tip-label">Pro Tip</div>
          </div>
          
          <h4 className="pro-tip-title">{tip.title}</h4>
          <p className="pro-tip-content">{tip.content}</p>
        </IonCardContent>
      </IonCard>
    </Wrapper>
  );
};

export default ProTipCard;

