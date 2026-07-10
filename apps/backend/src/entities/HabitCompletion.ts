import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Habit } from './Habit';

@Entity('habit_completions')
export class HabitCompletion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  habitId: string;

  @Column({ type: 'date' })
  completionDate: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Habit, (habit) => habit.completions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habitId' })
  habit: Habit;
}
