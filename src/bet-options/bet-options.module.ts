import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BetOptionsService } from './bet-options.service';
import { BetOptionsController } from './bet-options.controller';
import { BetOption } from './entities/bet-option.entity';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BetOption, Event])],
  controllers: [BetOptionsController],
  providers: [BetOptionsService],
  exports: [BetOptionsService],
})
export class BetOptionsModule {}
