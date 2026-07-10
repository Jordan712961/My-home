import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Habit } from '../entities/Habit';
import { HabitCompletion } from '../entities/HabitCompletion';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

export const habitRoutes = Router();
const habitRepository = AppDataSource.getRepository(Habit);
const completionRepository = AppDataSource.getRepository(HabitCompletion);

habitRoutes.use(authMiddleware);

habitRoutes.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const habits = await habitRepository
      .createQueryBuilder('habit')
      .where('habit.userId = :userId', { userId: req.userId })
      .leftJoinAndSelect('habit.completions', 'completions')
      .orderBy('habit.createdAt', 'DESC')
      .getMany();

    res.json({ count: habits.length, data: habits });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
});

habitRoutes.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, frequency, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const habit = habitRepository.create({
      userId: req.userId,
      name,
      description: description || null,
      frequency: frequency || 'daily',
      color: color || '#2196F3',
      currentStreak: 0,
      totalCompleted: 0,
      lastCompletedDate: null,
      isActive: true,
    });

    await habitRepository.save(habit);
    res.status(201).json({ message: 'Habit created', data: habit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create habit' });
  }
});

habitRoutes.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const habit = await habitRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    const { name, description, frequency, color, isActive } = req.body;
    if (name) habit.name = name;
    if (description !== undefined) habit.description = description;
    if (frequency) habit.frequency = frequency;
    if (color) habit.color = color;
    if (isActive !== undefined) habit.isActive = isActive;
    habit.updatedAt = new Date();

    await habitRepository.save(habit);
    res.json({ message: 'Habit updated', data: habit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update habit' });
  }
});

habitRoutes.post('/:id/complete', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const habit = await habitRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    const { completionDate, notes } = req.body;
    const date = completionDate || new Date().toISOString().split('T')[0];

    const completion = completionRepository.create({
      habitId: habit.id,
      completionDate: date,
      notes: notes || null,
    });

    await completionRepository.save(completion);

    habit.lastCompletedDate = date;
    habit.totalCompleted += 1;
    habit.updatedAt = new Date();
    await habitRepository.save(habit);

    res.json({ message: 'Habit completed', data: { habit, completion } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete habit' });
  }
});

habitRoutes.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const habit = await habitRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    await habitRepository.remove(habit);
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete habit' });
  }
});
