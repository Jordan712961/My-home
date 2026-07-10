import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('meals')
export class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  calories: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  protein: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  carbs: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  fat: number;

  @Column({ type: 'varchar', length: 50, default: 'snack' })
  mealType: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time', nullable: true })
  time: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  ingredients: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.meals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
