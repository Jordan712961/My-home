import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { HabitCompletion } from './HabitCompletion';

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'daily' })
  frequency: string;

  @Column({ type: 'integer', default: 0 })
  currentStreak: number;

  @Column({ type: 'integer', default: 0 })
  totalCompleted: number;

  @Column({ type: 'date', nullable: true })
  lastCompletedDate: string;

  @Column({ type: 'varchar', length: 7, default: '#2196F3' })
  color: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @OneToMany(() => HabitCompletion, (completion) => completion.habit, { cascade: true })
  completions: HabitCompletion[];

  @ManyToOne(() => User, (user) => user.habits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
