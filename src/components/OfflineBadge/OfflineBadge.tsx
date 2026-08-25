import React from 'react';
import { IonButton, IonIcon, IonLabel } from '@ionic/react';
import { cloudOfflineOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

import useOnlineStatus from '../../hooks/useOnlineStatus';
import './OfflineBadge.css';

const OfflineBadge: React.FC = () => {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <IonButton
      className="offline-badge"
      fill="clear"
      color="warning"
      size="small"
      disabled
      title={t('workout.videoUnavailableTitle')}
    >
      <IonIcon icon={cloudOfflineOutline} />
      <IonLabel>{t('common.offline')}</IonLabel>
    </IonButton>
  );
};

export default OfflineBadge;
