import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { SleepLog } from '../entities/SleepLog';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

export const sleepRoutes = Router();
const sleepLogRepository = AppDataSource.getRepository(SleepLog);

sleepRoutes.use(authMiddleware);

sleepRoutes.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;
    let query = sleepLogRepository
      .createQueryBuilder('sleep')
      .where('sleep.userId = :userId', { userId: req.userId })
      .orderBy('sleep.startTime', 'DESC');

    if (startDate) query = query.andWhere('sleep.startTime >= :startDate', { startDate });
    if (endDate) query = query.andWhere('sleep.startTime <= :endDate', { endDate });

    const logs = await query.limit(Number(limit)).getMany();
    res.json({ count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sleep logs' });
  }
});

sleepRoutes.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startTime, endTime, qualityRating, notes } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({ error: 'startTime and endTime are required' });
    }

    const log = sleepLogRepository.create({
      userId: req.userId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      qualityRating: qualityRating || 3,
      notes: notes || null,
    });

    await sleepLogRepository.save(log);
    res.status(201).json({ message: 'Sleep log created', data: log });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sleep log' });
  }
});

sleepRoutes.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const log = await sleepLogRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!log) return res.status(404).json({ error: 'Sleep log not found' });

    const { startTime, endTime, qualityRating, notes } = req.body;
    if (startTime) log.startTime = new Date(startTime);
    if (endTime) log.endTime = new Date(endTime);
    if (qualityRating !== undefined) log.qualityRating = qualityRating;
    if (notes !== undefined) log.notes = notes;

    await sleepLogRepository.save(log);
    res.json({ message: 'Sleep log updated', data: log });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update sleep log' });
  }
});

sleepRoutes.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const log = await sleepLogRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!log) return res.status(404).json({ error: 'Sleep log not found' });

    await sleepLogRepository.remove(log);
    res.json({ message: 'Sleep log deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sleep log' });
  }
});
