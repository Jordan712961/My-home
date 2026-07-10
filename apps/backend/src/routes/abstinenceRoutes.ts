import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { AbstinenceTracking } from '../entities/AbstinenceTracking';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

export const abstinenceRoutes = Router();
const abstinenceRepository = AppDataSource.getRepository(AbstinenceTracking);

abstinenceRoutes.use(authMiddleware);

abstinenceRoutes.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const trackings = await abstinenceRepository
      .createQueryBuilder('abstinence')
      .where('abstinence.userId = :userId', { userId: req.userId })
      .orderBy('abstinence.startDate', 'DESC')
      .getMany();

    res.json({ count: trackings.length, data: trackings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch abstinence tracking' });
  }
});

abstinenceRoutes.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { substance, startDate, lastUseDate, milestones, notes } = req.body;

    if (!substance || !startDate) {
      return res.status(400).json({ error: 'substance and startDate are required' });
    }

    const tracking = abstinenceRepository.create({
      userId: req.userId,
      substance,
      startDate,
      lastUseDate: lastUseDate || null,
      milestones: milestones || null,
      notes: notes || null,
      isActive: true,
    });

    await abstinenceRepository.save(tracking);
    res.status(201).json({ message: 'Abstinence tracking created', data: tracking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create abstinence tracking' });
  }
});

abstinenceRoutes.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tracking = await abstinenceRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!tracking) return res.status(404).json({ error: 'Abstinence tracking not found' });

    const { substance, startDate, lastUseDate, milestones, notes, isActive } = req.body;
    if (substance) tracking.substance = substance;
    if (startDate) tracking.startDate = startDate;
    if (lastUseDate !== undefined) tracking.lastUseDate = lastUseDate;
    if (milestones !== undefined) tracking.milestones = milestones;
    if (notes !== undefined) tracking.notes = notes;
    if (isActive !== undefined) tracking.isActive = isActive;
    tracking.updatedAt = new Date();

    await abstinenceRepository.save(tracking);
    res.json({ message: 'Abstinence tracking updated', data: tracking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update abstinence tracking' });
  }
});

abstinenceRoutes.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tracking = await abstinenceRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!tracking) return res.status(404).json({ error: 'Abstinence tracking not found' });

    await abstinenceRepository.remove(tracking);
    res.json({ message: 'Abstinence tracking deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete abstinence tracking' });
  }
});
