import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { analyticsAPI } from '../services/api';

const Analytics = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [weightData, setWeightData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLoadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getWeightAnalytics(period);
      setWeightData(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics & Insights
      </Typography>

      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={(e, newPeriod) => {
            if (newPeriod) setPeriod(newPeriod);
          }}
          sx={{ mr: 2 }}
        >
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
          <ToggleButton value="year">Year</ToggleButton>
        </ToggleButtonGroup>
        <Button variant="contained" color="primary" onClick={handleLoadAnalytics}>
          Load Analytics
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {weightData && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weight Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="weight" stroke="#2196F3" name="Weight" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weight Statistics
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Start Weight
                  </Typography>
                  <Typography variant="h6">{weightData.stats.startWeight}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    End Weight
                  </Typography>
                  <Typography variant="h6">{weightData.stats.endWeight}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Change
                  </Typography>
                  <Typography variant="h6">{weightData.stats.change > 0 ? '+' : ''}{weightData.stats.change.toFixed(1)}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Trend
                  </Typography>
                  <Typography variant="h6">{weightData.stats.trend}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default Analytics;
