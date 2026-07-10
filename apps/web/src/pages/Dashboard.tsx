import { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  TrendingDown as WeightIcon,
  Hotel as SleepIcon,
  LocalDrink as WaterIcon,
  Restaurant as MealIcon,
  FitnessCenter as WorkoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../services/api';

interface DashboardData {
  date: string;
  weight: { value: number; date: string } | null;
  sleep: { duration: number; quality: number } | null;
  nutrition: { totalCalories: number; mealsCount: number };
  hydration: { totalWater: number; waterIntakesCount: number };
  workouts: { count: number; caloriesBurned: number };
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardAPI.getToday();
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const StatCard = ({
    icon,
    label,
    value,
    unit,
    path,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    unit?: string;
    path: string;
  }) => (
    <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
      <CardContent onClick={() => navigate(path)}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {icon}
          <Typography variant="subtitle2" sx={{ ml: 1 }}>
            {label}
          </Typography>
        </Box>
        <Typography variant="h5">
          {value}
          {unit && <span style={{ fontSize: '0.7em', marginLeft: 4 }}>{unit}</span>}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Today's Summary
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<WeightIcon color="primary" />}
            label="Latest Weight"
            value={dashboardData?.weight?.value || '--'}
            unit="kg"
            path="/weight"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<SleepIcon color="primary" />}
            label="Last Night's Sleep"
            value={dashboardData?.sleep ? `${(dashboardData.sleep.duration / 3600000).toFixed(1)}h` : '--'}
            path="/sleep"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<MealIcon color="primary" />}
            label="Calories Today"
            value={dashboardData?.nutrition.totalCalories || 0}
            unit="kcal"
            path="/meals"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<WaterIcon color="primary" />}
            label="Water Intake"
            value={dashboardData?.hydration.totalWater || 0}
            unit="ml"
            path="/water"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<WorkoutIcon color="primary" />}
            label="Workouts"
            value={dashboardData?.workouts.count || 0}
            path="/workouts"
          />
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Quick Add
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/weight')}
            >
              Log Weight
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/meals')}
            >
              Log Meal
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/water')}
            >
              Log Water
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/workouts')}
            >
              Log Workout
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/sleep')}
            >
              Log Sleep
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/journal')}
            >
              Write Journal
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;
