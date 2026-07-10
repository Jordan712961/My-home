import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('cravings')
export class Craving {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  substance: string;

  @Column({ type: 'integer', default: 3 })
  intensity: number;

  @Column({ type: 'text', nullable: true })
  triggers: string;

  @Column({ type: 'text', nullable: true })
  copingStrategy: string;

  @Column({ type: 'boolean', default: false })
  resistedCraving: boolean;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time', nullable: true })
  time: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.cravings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
