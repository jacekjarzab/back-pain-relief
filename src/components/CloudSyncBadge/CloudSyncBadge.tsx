import React, { useEffect, useState } from 'react';
import { IonButton, IonIcon, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { cloudDoneOutline, cloudOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

import { getGoogleDriveConnection, subscribeGoogleDriveUpdates } from '../../services/googleDrive';
import './CloudSyncBadge.css';

const CloudSyncBadge: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [connected, setConnected] = useState(() => Boolean(getGoogleDriveConnection()));

  useEffect(() => {
    const update = () => setConnected(Boolean(getGoogleDriveConnection()));
    update();

    return subscribeGoogleDriveUpdates(update);
  }, []);

  const label = t('settings.googleDrive');
  const status = connected ? t('settings.cloudStatusReady') : t('settings.cloudStatusDisconnected');

  return (
    <IonButton
      className="cloud-sync-badge"
      fill="clear"
      color={connected ? 'success' : 'medium'}
      size="small"
      onClick={() => history.push('/settings')}
      title={status}
    >
      <IonIcon icon={connected ? cloudDoneOutline : cloudOutline} />
      <IonLabel>{label}</IonLabel>
    </IonButton>
  );
};

export default CloudSyncBadge;
