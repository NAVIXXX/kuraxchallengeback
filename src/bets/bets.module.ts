import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BetsService } from './bets.service';
import { BetsController } from './bets.controller';
import { Bet } from './entities/bet.entity';
import { Event } from '../events/entities/event.entity';
import { BetOption } from '../bet-options/entities/bet-option.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bet, Event, BetOption, User])],
  controllers: [BetsController],
  providers: [BetsService],
  exports: [BetsService],
})
export class BetsModule {}
