import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Goal } from '../entities/Goal';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

export const goalRoutes = Router();
const goalRepository = AppDataSource.getRepository(Goal);

goalRoutes.use(authMiddleware);

goalRoutes.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, status, limit = 50 } = req.query;
    let query = goalRepository
      .createQueryBuilder('goal')
      .where('goal.userId = :userId', { userId: req.userId })
      .orderBy('goal.targetDate', 'ASC');

    if (category) query = query.andWhere('goal.category = :category', { category });
    if (status) query = query.andWhere('goal.status = :status', { status });

    const goals = await query.limit(Number(limit)).getMany();
    res.json({ count: goals.length, data: goals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

goalRoutes.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, category, targetValue, unit, startDate, targetDate } = req.body;

    if (!title || !category || !targetValue || !startDate || !targetDate) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const goal = goalRepository.create({
      userId: req.userId,
      title,
      description: description || null,
      category,
      targetValue: parseFloat(targetValue),
      unit: unit || null,
      startDate,
      targetDate,
      status: 'active',
      currentValue: 0,
    });

    await goalRepository.save(goal);
    res.status(201).json({ message: 'Goal created', data: goal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

goalRoutes.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const goal = await goalRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    const { title, description, targetValue, currentValue, status, targetDate } = req.body;
    if (title) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (targetValue !== undefined) goal.targetValue = parseFloat(targetValue);
    if (currentValue !== undefined) goal.currentValue = parseFloat(currentValue);
    if (status) goal.status = status;
    if (targetDate) goal.targetDate = targetDate;
    goal.updatedAt = new Date();

    await goalRepository.save(goal);
    res.json({ message: 'Goal updated', data: goal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

goalRoutes.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const goal = await goalRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    await goalRepository.remove(goal);
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});
