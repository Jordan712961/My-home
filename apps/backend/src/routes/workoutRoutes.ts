import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Workout } from '../entities/Workout';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

export const workoutRoutes = Router();
const workoutRepository = AppDataSource.getRepository(Workout);

workoutRoutes.use(authMiddleware);

workoutRoutes.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate, limit = 50 } = req.query;
    let query = workoutRepository
      .createQueryBuilder('workout')
      .where('workout.userId = :userId', { userId: req.userId })
      .orderBy('workout.date', 'DESC');

    if (startDate) query = query.andWhere('workout.date >= :startDate', { startDate });
    if (endDate) query = query.andWhere('workout.date <= :endDate', { endDate });

    const workouts = await query.limit(Number(limit)).getMany();
    res.json({ count: workouts.length, data: workouts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

workoutRoutes.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { exerciseType, duration, intensity, caloriesBurned, date, time, notes, distance } = req.body;

    if (!exerciseType || !duration || !date) {
      return res.status(400).json({ error: 'exerciseType, duration, and date are required' });
    }

    const workout = workoutRepository.create({
      userId: req.userId,
      exerciseType,
      duration: parseInt(duration),
      intensity: intensity || 'moderate',
      caloriesBurned: parseFloat(caloriesBurned) || 0,
      date,
      time: time || new Date().toTimeString().slice(0, 8),
      notes: notes || null,
      distance: distance ? parseFloat(distance) : null,
    });

    await workoutRepository.save(workout);
    res.status(201).json({ message: 'Workout created', data: workout });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create workout' });
  }
});

workoutRoutes.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const workout = await workoutRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    const { exerciseType, duration, intensity, caloriesBurned, date, time, notes, distance } = req.body;
    if (exerciseType) workout.exerciseType = exerciseType;
    if (duration) workout.duration = parseInt(duration);
    if (intensity) workout.intensity = intensity;
    if (caloriesBurned !== undefined) workout.caloriesBurned = parseFloat(caloriesBurned);
    if (date) workout.date = date;
    if (time) workout.time = time;
    if (notes !== undefined) workout.notes = notes;
    if (distance) workout.distance = parseFloat(distance);

    await workoutRepository.save(workout);
    res.json({ message: 'Workout updated', data: workout });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update workout' });
  }
});

workoutRoutes.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const workout = await workoutRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    await workoutRepository.remove(workout);
    res.json({ message: 'Workout deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});
