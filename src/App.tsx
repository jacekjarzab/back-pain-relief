import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, fitnessOutline, statsChartOutline, settingsOutline } from 'ionicons/icons';

/* Pages */
import Dashboard from './pages/Dashboard';
import Workout from './pages/Workout';
import ExerciseDetail from './pages/ExerciseDetail';
import Progress from './pages/Progress';
import Settings from './pages/Settings';

/* Context */
import { AppProvider } from './context/AppContext';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact({
  mode: 'ios', // Use iOS design for consistent look across platforms
});

const App: React.FC = () => (
  <IonApp>
    <AppProvider>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/dashboard">
              <Dashboard />
            </Route>
            <Route exact path="/workout">
              <Workout />
            </Route>
            <Route exact path="/exercise/:id">
              <ExerciseDetail />
            </Route>
            <Route exact path="/progress">
              <Progress />
            </Route>
            <Route exact path="/settings">
              <Settings />
            </Route>
            <Route exact path="/">
              <Redirect to="/dashboard" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="dashboard" href="/dashboard">
              <IonIcon icon={homeOutline} />
              <IonLabel>Today</IonLabel>
            </IonTabButton>
            <IonTabButton tab="workout" href="/workout">
              <IonIcon icon={fitnessOutline} />
              <IonLabel>Workout</IonLabel>
            </IonTabButton>
            <IonTabButton tab="progress" href="/progress">
              <IonIcon icon={statsChartOutline} />
              <IonLabel>Progress</IonLabel>
            </IonTabButton>
            <IonTabButton tab="settings" href="/settings">
              <IonIcon icon={settingsOutline} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </AppProvider>
  </IonApp>
);

export default App;
