import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { SubstanceUse } from '../entities/SubstanceUse';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

export const substanceUseRoutes = Router();
const substanceRepository = AppDataSource.getRepository(SubstanceUse);

substanceUseRoutes.use(authMiddleware);

substanceUseRoutes.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate, substance, limit = 50 } = req.query;
    let query = substanceRepository
      .createQueryBuilder('substance')
      .where('substance.userId = :userId', { userId: req.userId })
      .orderBy('substance.date', 'DESC');

    if (startDate) query = query.andWhere('substance.date >= :startDate', { startDate });
    if (endDate) query = query.andWhere('substance.date <= :endDate', { endDate });
    if (substance) query = query.andWhere('substance.substance = :substance', { substance });

    const uses = await query.limit(Number(limit)).getMany();
    res.json({ count: uses.length, data: uses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch substance use logs' });
  }
});

substanceUseRoutes.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { substance, quantity, date, time, notes, triggers } = req.body;

    if (!substance || !date) {
      return res.status(400).json({ error: 'substance and date are required' });
    }

    const log = substanceRepository.create({
      userId: req.userId,
      substance,
      quantity: quantity || null,
      date,
      time: time || new Date().toTimeString().slice(0, 8),
      notes: notes || null,
      triggers: triggers || null,
    });

    await substanceRepository.save(log);
    res.status(201).json({ message: 'Substance use logged', data: log });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log substance use' });
  }
});

substanceUseRoutes.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const log = await substanceRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!log) return res.status(404).json({ error: 'Substance use log not found' });

    const { substance, quantity, date, time, notes, triggers } = req.body;
    if (substance) log.substance = substance;
    if (quantity !== undefined) log.quantity = quantity;
    if (date) log.date = date;
    if (time) log.time = time;
    if (notes !== undefined) log.notes = notes;
    if (triggers !== undefined) log.triggers = triggers;

    await substanceRepository.save(log);
    res.json({ message: 'Substance use log updated', data: log });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update substance use log' });
  }
});

substanceUseRoutes.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const log = await substanceRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!log) return res.status(404).json({ error: 'Substance use log not found' });

    await substanceRepository.remove(log);
    res.json({ message: 'Substance use log deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete substance use log' });
  }
});
