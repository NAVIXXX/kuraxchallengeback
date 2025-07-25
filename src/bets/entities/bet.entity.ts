import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';
import { BetOption } from '../../bet-options/entities/bet-option.entity';

@Entity()
export class Bet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bets)
  user: User;

  @ManyToOne(() => Event)
  event: Event;

  @ManyToOne(() => BetOption)
  betOption: BetOption;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  potentialWinnings: number;

  @Column({ default: 'pending' })
  status: string; // pending, won, lost, refunded

  @CreateDateColumn()
  createdAt: Date;
}
