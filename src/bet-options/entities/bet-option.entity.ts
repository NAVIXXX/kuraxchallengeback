import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Event } from '../../events/entities/event.entity';

@Entity()
export class BetOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column('decimal', { precision: 5, scale: 2 })
  odds: number;

  @ManyToOne(() => Event, event => event.betOptions)
  event: Event;
}
