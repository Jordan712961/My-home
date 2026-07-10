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
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { weightAPI } from '../../services/api';
import { format } from 'date-fns';

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  time: string;
  notes: string | null;
}

const WeightTracker = () => {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await weightAPI.getAll({ limit: 30 });
      setEntries(response.data.data);
    } catch (error) {
      console.error('Error fetching weight logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!weight || !date) return;

    try {
      await weightAPI.create({
        weight: parseFloat(weight),
        date,
        notes,
      });
      setWeight('');
      setNotes('');
      setDate(new Date().toISOString().split('T')[0]);
      setOpenDialog(false);
      fetchEntries();
    } catch (error) {
      console.error('Error adding weight entry:', error);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await weightAPI.delete(id);
      fetchEntries();
    } catch (error) {
      console.error('Error deleting weight entry:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Weight Tracker</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Add Entry
        </Button>
      </Box>

      {entries.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Weight Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#2196F3" name="Weight (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Paper sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Date</TableCell>
              <TableCell align="right">Weight (kg)</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  No weight entries yet. Add your first entry!
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{format(new Date(entry.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell align="right">{entry.weight}</TableCell>
                  <TableCell>{entry.notes}</TableCell>
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Weight Entry</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Weight (kg)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            margin="normal"
            inputProps={{ step: '0.1' }}
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            margin="normal"
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

export default WeightTracker;
