import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('abstinence_tracking')
export class AbstinenceTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  substance: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  lastUseDate: string;

  @Column({ type: 'text', nullable: true })
  milestones: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.abstinenceTrackings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
