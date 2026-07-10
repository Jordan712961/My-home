import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { WeightLog } from './WeightLog';
import { SleepLog } from './SleepLog';
import { Meal } from './Meal';
import { Workout } from './Workout';
import { WaterIntake } from './WaterIntake';
import { JournalEntry } from './JournalEntry';
import { MoodLog } from './MoodLog';
import { Symptom } from './Symptom';
import { SubstanceUse } from './SubstanceUse';
import { Craving } from './Craving';
import { AbstinenceTracking } from './AbstinenceTracking';
import { Goal } from './Goal';
import { Habit } from './Habit';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 10, default: 'kg' })
  weightUnit: string;

  @Column({ type: 'varchar', length: 10, default: 'cm' })
  heightUnit: string;

  @Column({ type: 'varchar', length: 10, default: 'kcal' })
  energyUnit: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: string;

  @Column({ type: 'varchar', length: 10, default: 'unknown' })
  gender: string;

  @Column({ type: 'text', nullable: true })
  profilePhotoUrl: string;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => WeightLog, (weightLog) => weightLog.user, { cascade: true })
  weightLogs: WeightLog[];

  @OneToMany(() => SleepLog, (sleepLog) => sleepLog.user, { cascade: true })
  sleepLogs: SleepLog[];

  @OneToMany(() => Meal, (meal) => meal.user, { cascade: true })
  meals: Meal[];

  @OneToMany(() => Workout, (workout) => workout.user, { cascade: true })
  workouts: Workout[];

  @OneToMany(() => WaterIntake, (waterIntake) => waterIntake.user, { cascade: true })
  waterIntakes: WaterIntake[];

  @OneToMany(() => JournalEntry, (journalEntry) => journalEntry.user, { cascade: true })
  journalEntries: JournalEntry[];

  @OneToMany(() => MoodLog, (moodLog) => moodLog.user, { cascade: true })
  moodLogs: MoodLog[];

  @OneToMany(() => Symptom, (symptom) => symptom.user, { cascade: true })
  symptoms: Symptom[];

  @OneToMany(() => SubstanceUse, (substanceUse) => substanceUse.user, { cascade: true })
  substanceUses: SubstanceUse[];

  @OneToMany(() => Craving, (craving) => craving.user, { cascade: true })
  cravings: Craving[];

  @OneToMany(() => AbstinenceTracking, (abstinenceTracking) => abstinenceTracking.user, { cascade: true })
  abstinenceTrackings: AbstinenceTracking[];

  @OneToMany(() => Goal, (goal) => goal.user, { cascade: true })
  goals: Goal[];

  @OneToMany(() => Habit, (habit) => habit.user, { cascade: true })
  habits: Habit[];
}
