import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppDataSource } from './config/database';
import { authRoutes } from './routes/authRoutes';
import { userRoutes } from './routes/userRoutes';
import { weightRoutes } from './routes/weightRoutes';
import { sleepRoutes } from './routes/sleepRoutes';
import { mealRoutes } from './routes/mealRoutes';
import { workoutRoutes } from './routes/workoutRoutes';
import { waterRoutes } from './routes/waterRoutes';
import { journalRoutes } from './routes/journalRoutes';
import { moodRoutes } from './routes/moodRoutes';
import { symptomRoutes } from './routes/symptomRoutes';
import { substanceUseRoutes } from './routes/substanceUseRoutes';
import { cravingRoutes } from './routes/cravingRoutes';
import { abstinenceRoutes } from './routes/abstinenceRoutes';
import { goalRoutes } from './routes/goalRoutes';
import { habitRoutes } from './routes/habitRoutes';
import { dashboardRoutes } from './routes/dashboardRoutes';
import { analyticsRoutes } from './routes/analyticsRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/weight', weightRoutes);
    app.use('/api/sleep', sleepRoutes);
    app.use('/api/meals', mealRoutes);
    app.use('/api/workouts', workoutRoutes);
    app.use('/api/water', waterRoutes);
    app.use('/api/journal', journalRoutes);
    app.use('/api/moods', moodRoutes);
    app.use('/api/symptoms', symptomRoutes);
    app.use('/api/substance-use', substanceUseRoutes);
    app.use('/api/cravings', cravingRoutes);
    app.use('/api/abstinence', abstinenceRoutes);
    app.use('/api/goals', goalRoutes);
    app.use('/api/habits', habitRoutes);
    app.use('/api/dashboard', dashboardRoutes);
    app.use('/api/analytics', analyticsRoutes);

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
    process.exit(1);
  });
