import { Routes as ReactRoutes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import WeightTracker from './pages/trackers/WeightTracker';
import SleepTracker from './pages/trackers/SleepTracker';
import MealTracker from './pages/trackers/MealTracker';
import WorkoutTracker from './pages/trackers/WorkoutTracker';
import WaterTracker from './pages/trackers/WaterTracker';
import JournalTracker from './pages/trackers/JournalTracker';
import MoodTracker from './pages/trackers/MoodTracker';
import SymptomTracker from './pages/trackers/SymptomTracker';
import SubstanceUseTracker from './pages/trackers/SubstanceUseTracker';
import CravingTracker from './pages/trackers/CravingTracker';
import AbstinenceTracker from './pages/trackers/AbstinenceTracker';
import GoalTracker from './pages/trackers/GoalTracker';
import HabitTracker from './pages/trackers/HabitTracker';
import Analytics from './pages/Analytics';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const Routes = () => {
  return (
    <ReactRoutes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/weight"
        element={
          <PrivateRoute>
            <WeightTracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/sleep"
        element={
          <PrivateRoute>
            <SleepTracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/meals"
        element={
          <PrivateRoute>
            <MealTracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/workouts"
        element={
          <PrivateRoute>
            <WorkoutTracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/water"
        element={
          <PrivateRoute>
            <WaterTracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/journal"
        element={
          <PrivateRoute>
            <JournalTracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/moods"
        element={
          <PrivateRoute>
            <MoodTracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/symptoms"
        element={
          <PrivateRoute>
            <SymptomTracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/substance-use"
        element={
          <PrivateRoute>
            <SubstanceUseTracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/cravings"
        element={
          <PrivateRoute>
            <CravingTracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/abstinence"
        element={
          <PrivateRoute>
            <AbstinenceTracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <PrivateRoute>
            <GoalTracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/habits"
        element={
          <PrivateRoute>
            <HabitTracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <Analytics />
          </PrivateRoute>
        }
      />
    </ReactRoutes>
  );
};

export default Routes;
