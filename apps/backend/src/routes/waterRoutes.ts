import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { WaterIntake } from '../entities/WaterIntake';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

export const waterRoutes = Router();
const waterRepository = AppDataSource.getRepository(WaterIntake);

waterRoutes.use(authMiddleware);

waterRoutes.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { date, limit = 50 } = req.query;
    let query = waterRepository
      .createQueryBuilder('water')
      .where('water.userId = :userId', { userId: req.userId })
      .orderBy('water.date', 'DESC');

    if (date) query = query.andWhere('water.date = :date', { date });

    const logs = await query.limit(Number(limit)).getMany();
    res.json({ count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch water intake' });
  }
});

waterRoutes.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { amountMl, date, time } = req.body;

    if (!amountMl || !date) {
      return res.status(400).json({ error: 'amountMl and date are required' });
    }

    const log = waterRepository.create({
      userId: req.userId,
      amountMl: parseInt(amountMl),
      date,
      time: time || new Date().toTimeString().slice(0, 8),
    });

    await waterRepository.save(log);
    res.status(201).json({ message: 'Water intake logged', data: log });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log water intake' });
  }
});

waterRoutes.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const log = await waterRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!log) return res.status(404).json({ error: 'Water intake log not found' });

    await waterRepository.remove(log);
    res.json({ message: 'Water intake deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete water intake' });
  }
});
