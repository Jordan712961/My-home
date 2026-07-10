import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('substance_use')
export class SubstanceUse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  substance: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  quantity: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time', nullable: true })
  time: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  triggers: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.substanceUses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
