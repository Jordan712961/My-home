import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { WeightLog } from '../entities/WeightLog';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

export const weightRoutes = Router();

const weightLogRepository = AppDataSource.getRepository(WeightLog);

weightRoutes.use(authMiddleware);

// Get all weight logs for user
weightRoutes.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate, limit = 100 } = req.query;

    let query = weightLogRepository
      .createQueryBuilder('weight')
      .where('weight.userId = :userId', { userId: req.userId })
      .orderBy('weight.date', 'DESC');

    if (startDate) {
      query = query.andWhere('weight.date >= :startDate', { startDate });
    }
    if (endDate) {
      query = query.andWhere('weight.date <= :endDate', { endDate });
    }

    const logs = await query.limit(Number(limit)).getMany();

    res.json({
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error('Error fetching weight logs:', error);
    res.status(500).json({ error: 'Failed to fetch weight logs' });
  }
});

// Get weight log by ID
weightRoutes.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const log = await weightLogRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!log) {
      return res.status(404).json({ error: 'Weight log not found' });
    }

    res.json(log);
  } catch (error) {
    console.error('Error fetching weight log:', error);
    res.status(500).json({ error: 'Failed to fetch weight log' });
  }
});

// Create weight log
weightRoutes.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { weight, date, time, notes } = req.body;

    if (!weight || !date) {
      return res.status(400).json({ error: 'Weight and date are required' });
    }

    const log = weightLogRepository.create({
      userId: req.userId,
      weight: parseFloat(weight),
      date,
      time: time || new Date().toTimeString().slice(0, 8),
      notes: notes || null,
    });

    await weightLogRepository.save(log);

    res.status(201).json({
      message: 'Weight log created successfully',
      data: log,
    });
  } catch (error) {
    console.error('Error creating weight log:', error);
    res.status(500).json({ error: 'Failed to create weight log' });
  }
});

// Update weight log
weightRoutes.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const log = await weightLogRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!log) {
      return res.status(404).json({ error: 'Weight log not found' });
    }

    const { weight, date, time, notes } = req.body;

    if (weight !== undefined) log.weight = parseFloat(weight);
    if (date) log.date = date;
    if (time) log.time = time;
    if (notes !== undefined) log.notes = notes;

    await weightLogRepository.save(log);

    res.json({
      message: 'Weight log updated successfully',
      data: log,
    });
  } catch (error) {
    console.error('Error updating weight log:', error);
    res.status(500).json({ error: 'Failed to update weight log' });
  }
});

// Delete weight log
weightRoutes.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const log = await weightLogRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!log) {
      return res.status(404).json({ error: 'Weight log not found' });
    }

    await weightLogRepository.remove(log);

    res.json({ message: 'Weight log deleted successfully' });
  } catch (error) {
    console.error('Error deleting weight log:', error);
    res.status(500).json({ error: 'Failed to delete weight log' });
  }
});
