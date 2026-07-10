import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { mealAPI } from '../../services/api';
import { format } from 'date-fns';

interface MealEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: string;
  date: string;
  time: string;
  notes: string | null;
}

const MealTracker = () => {
  const [entries, setEntries] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    mealType: 'snack',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 8),
    notes: '',
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await mealAPI.getAll({ limit: 30 });
      setEntries(response.data.data);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!formData.name || !formData.date) return;

    try {
      await mealAPI.create(formData);
      setFormData({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        mealType: 'snack',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 8),
        notes: '',
      });
      setOpenDialog(false);
      fetchEntries();
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await mealAPI.delete(id);
      fetchEntries();
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = entries.reduce((sum, entry) => sum + entry.protein, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Meal Tracker</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Add Meal
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Today's Summary</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="textSecondary">Total Calories</Typography>
              <Typography variant="h6">{totalCalories.toFixed(0)}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">Protein</Typography>
              <Typography variant="h6">{totalProtein.toFixed(1)}g</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Paper sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Date</TableCell>
              <TableCell>Meal</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Protein</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No meals logged yet. Add your first meal!
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{format(new Date(entry.date), 'MMM dd')}</TableCell>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell align="right">{entry.calories}</TableCell>
                  <TableCell align="right">{entry.protein}g</TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteEntry(entry.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Meal</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Meal Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Meal Type</InputLabel>
            <Select
              value={formData.mealType}
              onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
              label="Meal Type"
            >
              <MenuItem value="breakfast">Breakfast</MenuItem>
              <MenuItem value="lunch">Lunch</MenuItem>
              <MenuItem value="dinner">Dinner</MenuItem>
              <MenuItem value="snack">Snack</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Calories"
            type="number"
            value={formData.calories}
            onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Protein (g)"
            type="number"
            value={formData.protein}
            onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddEntry} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MealTracker;
