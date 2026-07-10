import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { MoodLog } from '../entities/MoodLog';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

export const moodRoutes = Router();
const moodRepository = AppDataSource.getRepository(MoodLog);

moodRoutes.use(authMiddleware);

moodRoutes.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate, limit = 50 } = req.query;
    let query = moodRepository
      .createQueryBuilder('mood')
      .where('mood.userId = :userId', { userId: req.userId })
      .orderBy('mood.date', 'DESC');

    if (startDate) query = query.andWhere('mood.date >= :startDate', { startDate });
    if (endDate) query = query.andWhere('mood.date <= :endDate', { endDate });

    const logs = await query.limit(Number(limit)).getMany();
    res.json({ count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mood logs' });
  }
});

moodRoutes.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { mood, intensity, date, time, notes, triggers } = req.body;

    if (!mood || !date) {
      return res.status(400).json({ error: 'mood and date are required' });
    }

    const log = moodRepository.create({
      userId: req.userId,
      mood,
      intensity: intensity || 3,
      date,
      time: time || new Date().toTimeString().slice(0, 8),
      notes: notes || null,
      triggers: triggers || null,
    });

    await moodRepository.save(log);
    res.status(201).json({ message: 'Mood logged', data: log });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log mood' });
  }
});

moodRoutes.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const log = await moodRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!log) return res.status(404).json({ error: 'Mood log not found' });

    const { mood, intensity, date, time, notes, triggers } = req.body;
    if (mood) log.mood = mood;
    if (intensity !== undefined) log.intensity = intensity;
    if (date) log.date = date;
    if (time) log.time = time;
    if (notes !== undefined) log.notes = notes;
    if (triggers !== undefined) log.triggers = triggers;

    await moodRepository.save(log);
    res.json({ message: 'Mood log updated', data: log });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update mood log' });
  }
});

moodRoutes.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const log = await moodRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!log) return res.status(404).json({ error: 'Mood log not found' });

    await moodRepository.remove(log);
    res.json({ message: 'Mood log deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete mood log' });
  }
});
