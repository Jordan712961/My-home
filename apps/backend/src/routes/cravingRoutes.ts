import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Craving } from '../entities/Craving';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

export const cravingRoutes = Router();
const cravingRepository = AppDataSource.getRepository(Craving);

cravingRoutes.use(authMiddleware);

cravingRoutes.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate, substance, resisted, limit = 50 } = req.query;
    let query = cravingRepository
      .createQueryBuilder('craving')
      .where('craving.userId = :userId', { userId: req.userId })
      .orderBy('craving.date', 'DESC');

    if (startDate) query = query.andWhere('craving.date >= :startDate', { startDate });
    if (endDate) query = query.andWhere('craving.date <= :endDate', { endDate });
    if (substance) query = query.andWhere('craving.substance = :substance', { substance });
    if (resisted) query = query.andWhere('craving.resistedCraving = :resisted', { resisted: resisted === 'true' });

    const cravings = await query.limit(Number(limit)).getMany();
    res.json({ count: cravings.length, data: cravings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cravings' });
  }
});

cravingRoutes.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { substance, intensity, triggers, copingStrategy, resistedCraving, date, time, notes } = req.body;

    if (!substance || !date) {
      return res.status(400).json({ error: 'substance and date are required' });
    }

    const craving = cravingRepository.create({
      userId: req.userId,
      substance,
      intensity: intensity || 3,
      triggers: triggers || null,
      copingStrategy: copingStrategy || null,
      resistedCraving: resistedCraving || false,
      date,
      time: time || new Date().toTimeString().slice(0, 8),
      notes: notes || null,
    });

    await cravingRepository.save(craving);
    res.status(201).json({ message: 'Craving logged', data: craving });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log craving' });
  }
});

cravingRoutes.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const craving = await cravingRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!craving) return res.status(404).json({ error: 'Craving not found' });

    const { substance, intensity, triggers, copingStrategy, resistedCraving, date, time, notes } = req.body;
    if (substance) craving.substance = substance;
    if (intensity !== undefined) craving.intensity = intensity;
    if (triggers !== undefined) craving.triggers = triggers;
    if (copingStrategy !== undefined) craving.copingStrategy = copingStrategy;
    if (resistedCraving !== undefined) craving.resistedCraving = resistedCraving;
    if (date) craving.date = date;
    if (time) craving.time = time;
    if (notes !== undefined) craving.notes = notes;

    await cravingRepository.save(craving);
    res.json({ message: 'Craving updated', data: craving });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update craving' });
  }
});

cravingRoutes.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const craving = await cravingRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!craving) return res.status(404).json({ error: 'Craving not found' });

    await cravingRepository.remove(craving);
    res.json({ message: 'Craving deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete craving' });
  }
});
