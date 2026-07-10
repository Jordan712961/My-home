import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('symptoms')
export class Symptom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  symptomName: string;

  @Column({ type: 'integer', default: 3 })
  severity: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time', nullable: true })
  time: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  category: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.symptoms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
