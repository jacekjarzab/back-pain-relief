import React from 'react';
import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { fitnessOutline, cloudDoneOutline, phonePortraitOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './Splash.css';

const Splash: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <IonPage>
      <IonContent fullscreen className="splash-page">
        <div className="splash-shell">
          <div className="splash-hero">
            <div className="splash-badge">
              <IonIcon icon={fitnessOutline} />
            </div>

            <p className="splash-kicker">{t('splash.kicker')}</p>
            <h1>{t('splash.title')}</h1>
            <p className="splash-copy">{t('splash.subtitle')}</p>
          </div>

          <div className="splash-features" aria-label={t('splash.featuresLabel')}>
            <div className="splash-feature">
              <IonIcon icon={fitnessOutline} />
              <span>{t('splash.featureRoutine')}</span>
            </div>
            <div className="splash-feature">
              <IonIcon icon={phonePortraitOutline} />
              <span>{t('splash.featureOffline')}</span>
            </div>
            <div className="splash-feature">
              <IonIcon icon={cloudDoneOutline} />
              <span>{t('splash.featureSync')}</span>
            </div>
          </div>

          <div className="splash-actions">
            <IonButton expand="block" size="large" onClick={() => history.push('/dashboard')}>
              {t('splash.enterApp')}
            </IonButton>
            <p className="splash-note">{t('splash.note')}</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Splash;
