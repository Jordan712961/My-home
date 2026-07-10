import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('workouts')
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  exerciseType: string;

  @Column({ type: 'integer' })
  duration: number;

  @Column({ type: 'varchar', length: 50, default: 'moderate' })
  intensity: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  caloriesBurned: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time', nullable: true })
  time: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  distance: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.workouts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
