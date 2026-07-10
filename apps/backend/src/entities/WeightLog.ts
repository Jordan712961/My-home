import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('weight_logs')
export class WeightLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  weight: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time', nullable: true })
  time: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.weightLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
