import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Meal } from '../entities/Meal';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

export const mealRoutes = Router();
const mealRepository = AppDataSource.getRepository(Meal);

mealRoutes.use(authMiddleware);

mealRoutes.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { date, mealType, limit = 100 } = req.query;
    let query = mealRepository
      .createQueryBuilder('meal')
      .where('meal.userId = :userId', { userId: req.userId })
      .orderBy('meal.date', 'DESC');

    if (date) query = query.andWhere('meal.date = :date', { date });
    if (mealType) query = query.andWhere('meal.mealType = :mealType', { mealType });

    const meals = await query.limit(Number(limit)).getMany();
    res.json({ count: meals.length, data: meals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

mealRoutes.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, calories, protein, carbs, fat, mealType, date, time, notes, ingredients } = req.body;

    if (!name || !date) {
      return res.status(400).json({ error: 'name and date are required' });
    }

    const meal = mealRepository.create({
      userId: req.userId,
      name,
      calories: parseFloat(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      mealType: mealType || 'snack',
      date,
      time: time || new Date().toTimeString().slice(0, 8),
      notes: notes || null,
      ingredients: ingredients || null,
    });

    await mealRepository.save(meal);
    res.status(201).json({ message: 'Meal created', data: meal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meal' });
  }
});

mealRoutes.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const meal = await mealRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!meal) return res.status(404).json({ error: 'Meal not found' });

    const { name, calories, protein, carbs, fat, mealType, date, time, notes, ingredients } = req.body;
    if (name) meal.name = name;
    if (calories !== undefined) meal.calories = parseFloat(calories);
    if (protein !== undefined) meal.protein = parseFloat(protein);
    if (carbs !== undefined) meal.carbs = parseFloat(carbs);
    if (fat !== undefined) meal.fat = parseFloat(fat);
    if (mealType) meal.mealType = mealType;
    if (date) meal.date = date;
    if (time) meal.time = time;
    if (notes !== undefined) meal.notes = notes;
    if (ingredients) meal.ingredients = ingredients;

    await mealRepository.save(meal);
    res.json({ message: 'Meal updated', data: meal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update meal' });
  }
});

mealRoutes.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const meal = await mealRepository.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!meal) return res.status(404).json({ error: 'Meal not found' });

    await mealRepository.remove(meal);
    res.json({ message: 'Meal deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete meal' });
  }
});
