import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  targetValue: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unit: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  targetDate: string;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentValue: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.goals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
