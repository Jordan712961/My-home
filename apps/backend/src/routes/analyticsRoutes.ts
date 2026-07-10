import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { WeightLog } from '../entities/WeightLog';
import { Meal } from '../entities/Meal';
import { MoodLog } from '../entities/MoodLog';
import { Craving } from '../entities/Craving';
import { SubstanceUse } from '../entities/SubstanceUse';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

export const analyticsRoutes = Router();

analyticsRoutes.use(authMiddleware);

// Weight analytics
analyticsRoutes.get('/weight/:period', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { period } = req.params;
    const today = new Date();
    let startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        return res.status(400).json({ error: 'Invalid period' });
    }

    const startDateStr = startDate.toISOString().split('T')[0];
    const weightRepository = AppDataSource.getRepository(WeightLog);

    const weights = await weightRepository.find({
      where: { userId: req.userId },
      order: { date: 'ASC' },
    });

    const filtered = weights.filter(w => w.date >= startDateStr);

    if (filtered.length === 0) {
      return res.json({ period, data: [], trend: 'stable', averageWeight: 0 });
    }

    const average = filtered.reduce((sum, w) => sum + Number(w.weight), 0) / filtered.length;
    const firstWeight = Number(filtered[0].weight);
    const lastWeight = Number(filtered[filtered.length - 1].weight);
    const trend = lastWeight < firstWeight ? 'down' : lastWeight > firstWeight ? 'up' : 'stable';
    const change = lastWeight - firstWeight;

    res.json({
      period,
      data: filtered.map(w => ({ date: w.date, weight: w.weight })),
      stats: {
        startWeight: firstWeight,
        endWeight: lastWeight,
        change,
        averageWeight: average,
        trend,
        minWeight: Math.min(...filtered.map(w => Number(w.weight))),
        maxWeight: Math.max(...filtered.map(w => Number(w.weight))),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weight analytics' });
  }
});

// Nutrition analytics
analyticsRoutes.get('/nutrition/:period', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { period } = req.params;
    const today = new Date();
    let startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      default:
        return res.status(400).json({ error: 'Invalid period' });
    }

    const startDateStr = startDate.toISOString().split('T')[0];
    const mealRepository = AppDataSource.getRepository(Meal);

    const meals = await mealRepository.find({
      where: { userId: req.userId },
      order: { date: 'ASC' },
    });

    const filtered = meals.filter(m => m.date >= startDateStr);

    const dailyData: { [key: string]: any } = {};
    filtered.forEach(meal => {
      if (!dailyData[meal.date]) {
        dailyData[meal.date] = { calories: 0, protein: 0, carbs: 0, fat: 0, meals: 0 };
      }
      dailyData[meal.date].calories += Number(meal.calories);
      dailyData[meal.date].protein += Number(meal.protein);
      dailyData[meal.date].carbs += Number(meal.carbs);
      dailyData[meal.date].fat += Number(meal.fat);
      dailyData[meal.date].meals += 1;
    });

    const stats = Object.values(dailyData);
    const avgCalories = stats.length > 0 ? stats.reduce((sum: any, d: any) => sum + d.calories, 0) / stats.length : 0;

    res.json({
      period,
      daily: Object.entries(dailyData).map(([date, data]) => ({ date, ...data })),
      stats: {
        totalMeals: filtered.length,
        averageDailyCalories: avgCalories,
        totalCalories: filtered.reduce((sum, m) => sum + Number(m.calories), 0),
        averageProtein: stats.length > 0 ? stats.reduce((sum: any, d: any) => sum + d.protein, 0) / stats.length : 0,
        averageCarbs: stats.length > 0 ? stats.reduce((sum: any, d: any) => sum + d.carbs, 0) / stats.length : 0,
        averageFat: stats.length > 0 ? stats.reduce((sum: any, d: any) => sum + d.fat, 0) / stats.length : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nutrition analytics' });
  }
});

// Mood analytics
analyticsRoutes.get('/mood/:period', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { period } = req.params;
    const today = new Date();
    let startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      default:
        return res.status(400).json({ error: 'Invalid period' });
    }

    const startDateStr = startDate.toISOString().split('T')[0];
    const moodRepository = AppDataSource.getRepository(MoodLog);

    const moods = await moodRepository.find({
      where: { userId: req.userId },
      order: { date: 'ASC' },
    });

    const filtered = moods.filter(m => m.date >= startDateStr);

    const moodCounts: { [key: string]: number } = {};
    filtered.forEach(mood => {
      moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
    });

    const averageIntensity = filtered.length > 0 ? filtered.reduce((sum, m) => sum + m.intensity, 0) / filtered.length : 0;

    res.json({
      period,
      data: filtered.map(m => ({ date: m.date, mood: m.mood, intensity: m.intensity })),
      stats: {
        totalEntries: filtered.length,
        moodDistribution: moodCounts,
        averageIntensity,
        dominantMood: Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b, ''),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mood analytics' });
  }
});

// Craving analytics
analyticsRoutes.get('/cravings/:period', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { period } = req.params;
    const today = new Date();
    let startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      default:
        return res.status(400).json({ error: 'Invalid period' });
    }

    const startDateStr = startDate.toISOString().split('T')[0];
    const cravingRepository = AppDataSource.getRepository(Craving);

    const cravings = await cravingRepository.find({
      where: { userId: req.userId },
      order: { date: 'ASC' },
    });

    const filtered = cravings.filter(c => c.date >= startDateStr);

    const resistedCount = filtered.filter(c => c.resistedCraving).length;
    const totalCount = filtered.length;
    const successRate = totalCount > 0 ? (resistedCount / totalCount) * 100 : 0;

    const substanceCounts: { [key: string]: { total: number; resisted: number } } = {};
    filtered.forEach(craving => {
      if (!substanceCounts[craving.substance]) {
        substanceCounts[craving.substance] = { total: 0, resisted: 0 };
      }
      substanceCounts[craving.substance].total += 1;
      if (craving.resistedCraving) {
        substanceCounts[craving.substance].resisted += 1;
      }
    });

    res.json({
      period,
      stats: {
        totalCravings: totalCount,
        resistedCravings: resistedCount,
        cravingsYielded: totalCount - resistedCount,
        successRate,
        substanceBreakdown: substanceCounts,
        averageIntensity: filtered.length > 0 ? filtered.reduce((sum, c) => sum + c.intensity, 0) / filtered.length : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch craving analytics' });
  }
});

// Substance use analytics
analyticsRoutes.get('/substance/:period', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { period } = req.params;
    const today = new Date();
    let startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      default:
        return res.status(400).json({ error: 'Invalid period' });
    }

    const startDateStr = startDate.toISOString().split('T')[0];
    const substanceRepository = AppDataSource.getRepository(SubstanceUse);

    const uses = await substanceRepository.find({
      where: { userId: req.userId },
      order: { date: 'ASC' },
    });

    const filtered = uses.filter(u => u.date >= startDateStr);

    const substanceCounts: { [key: string]: number } = {};
    filtered.forEach(use => {
      substanceCounts[use.substance] = (substanceCounts[use.substance] || 0) + 1;
    });

    res.json({
      period,
      data: filtered.map(u => ({ date: u.date, substance: u.substance, quantity: u.quantity })),
      stats: {
        totalUses: filtered.length,
        substanceBreakdown: substanceCounts,
        mostUsedSubstance: Object.keys(substanceCounts).reduce((a, b) => substanceCounts[a] > substanceCounts[b] ? a : b, ''),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch substance use analytics' });
  }
});
