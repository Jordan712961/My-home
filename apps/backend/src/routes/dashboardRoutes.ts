import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { WeightLog } from '../entities/WeightLog';
import { SleepLog } from '../entities/SleepLog';
import { Meal } from '../entities/Meal';
import { WaterIntake } from '../entities/WaterIntake';
import { Workout } from '../entities/Workout';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

export const dashboardRoutes = Router();

dashboardRoutes.use(authMiddleware);

dashboardRoutes.get('/today', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const weightLogRepository = AppDataSource.getRepository(WeightLog);
    const sleepLogRepository = AppDataSource.getRepository(SleepLog);
    const mealRepository = AppDataSource.getRepository(Meal);
    const waterRepository = AppDataSource.getRepository(WaterIntake);
    const workoutRepository = AppDataSource.getRepository(Workout);

    const [latestWeight, todaySleep, todayMeals, todayWater, todayWorkouts] = await Promise.all([
      weightLogRepository.findOne({
        where: { userId: req.userId },
        order: { date: 'DESC' },
      }),
      sleepLogRepository.find({
        where: { userId: req.userId },
        order: { startTime: 'DESC' },
        take: 1,
      }),
      mealRepository.find({
        where: { userId: req.userId, date: today },
      }),
      waterRepository.find({
        where: { userId: req.userId, date: today },
      }),
      workoutRepository.find({
        where: { userId: req.userId, date: today },
      }),
    ]);

    const totalCalories = todayMeals.reduce((sum, meal) => sum + Number(meal.calories), 0);
    const totalWater = todayWater.reduce((sum, water) => sum + water.amountMl, 0);
    const totalCaloriesBurned = todayWorkouts.reduce((sum, workout) => sum + Number(workout.caloriesBurned), 0);

    res.json({
      date: today,
      weight: latestWeight ? { value: latestWeight.weight, date: latestWeight.date } : null,
      sleep: todaySleep.length > 0 ? {
        duration: todaySleep[0].endTime.getTime() - todaySleep[0].startTime.getTime(),
        quality: todaySleep[0].qualityRating,
      } : null,
      nutrition: {
        totalCalories,
        mealsCount: todayMeals.length,
      },
      hydration: {
        totalWater,
        waterIntakesCount: todayWater.length,
      },
      workouts: {
        count: todayWorkouts.length,
        caloriesBurned: totalCaloriesBurned,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

dashboardRoutes.get('/stats/:period', async (req: AuthenticatedRequest, res: Response) => {
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

    const weightLogRepository = AppDataSource.getRepository(WeightLog);
    const sleepLogRepository = AppDataSource.getRepository(SleepLog);
    const mealRepository = AppDataSource.getRepository(Meal);
    const workoutRepository = AppDataSource.getRepository(Workout);

    const [weights, sleepLogs, meals, workouts] = await Promise.all([
      weightLogRepository.find({
        where: { userId: req.userId },
        order: { date: 'ASC' },
      }),
      sleepLogRepository.find({
        where: { userId: req.userId },
        order: { startTime: 'ASC' },
      }),
      mealRepository.find({
        where: { userId: req.userId },
        order: { date: 'ASC' },
      }),
      workoutRepository.find({
        where: { userId: req.userId },
        order: { date: 'ASC' },
      }),
    ]);

    const filteredWeights = weights.filter(w => w.date >= startDateStr);
    const filteredSleepLogs = sleepLogs.filter(s => s.startTime.toISOString().split('T')[0] >= startDateStr);
    const filteredMeals = meals.filter(m => m.date >= startDateStr);
    const filteredWorkouts = workouts.filter(w => w.date >= startDateStr);

    res.json({
      period,
      startDate: startDateStr,
      endDate: today.toISOString().split('T')[0],
      weight: {
        count: filteredWeights.length,
        latest: filteredWeights.length > 0 ? filteredWeights[filteredWeights.length - 1].weight : null,
        average: filteredWeights.length > 0 ? filteredWeights.reduce((sum, w) => sum + Number(w.weight), 0) / filteredWeights.length : 0,
        data: filteredWeights.map(w => ({ date: w.date, value: w.weight })),
      },
      sleep: {
        count: filteredSleepLogs.length,
        averageHours: filteredSleepLogs.length > 0 ? filteredSleepLogs.reduce((sum, s) => sum + (s.endTime.getTime() - s.startTime.getTime()) / 3600000, 0) / filteredSleepLogs.length : 0,
      },
      meals: {
        count: filteredMeals.length,
        averageDailyCalories: filteredMeals.length > 0 ? filteredMeals.reduce((sum, m) => sum + Number(m.calories), 0) / filteredMeals.length : 0,
      },
      workouts: {
        count: filteredWorkouts.length,
        totalCaloriesBurned: filteredWorkouts.reduce((sum, w) => sum + Number(w.caloriesBurned), 0),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});
