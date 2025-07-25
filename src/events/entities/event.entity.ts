import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BetOption } from '../../bet-options/entities/bet-option.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sport: string;

  @Column()
  title: string;

  @Column()
  startTime: Date;

  @Column({ default: 'upcoming' })
  status: string;

  @OneToMany(() => BetOption, betOption => betOption.event)
  betOptions: BetOption[];
}
