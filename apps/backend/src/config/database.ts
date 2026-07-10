import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../entities/User';
import { WeightLog } from '../entities/WeightLog';
import { SleepLog } from '../entities/SleepLog';
import { Meal } from '../entities/Meal';
import { Workout } from '../entities/Workout';
import { WaterIntake } from '../entities/WaterIntake';
import { JournalEntry } from '../entities/JournalEntry';
import { MoodLog } from '../entities/MoodLog';
import { Symptom } from '../entities/Symptom';
import { SubstanceUse } from '../entities/SubstanceUse';
import { Craving } from '../entities/Craving';
import { AbstinenceTracking } from '../entities/AbstinenceTracking';
import { Goal } from '../entities/Goal';
import { Habit } from '../entities/Habit';
import { HabitCompletion } from '../entities/HabitCompletion';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'health_user',
  password: process.env.DB_PASSWORD || 'health_password',
  database: process.env.DB_NAME || 'health_wellness',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  entities: [
    User,
    WeightLog,
    SleepLog,
    Meal,
    Workout,
    WaterIntake,
    JournalEntry,
    MoodLog,
    Symptom,
    SubstanceUse,
    Craving,
    AbstinenceTracking,
    Goal,
    Habit,
    HabitCompletion,
  ],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
