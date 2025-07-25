import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BetOption } from './entities/bet-option.entity';
import { Event } from '../events/entities/event.entity';
import { CreateBetOptionDto } from './dto/create-bet-option.dto';

@Injectable()
export class BetOptionsService {
  constructor(
    @InjectRepository(BetOption)
    private readonly betOptionRepository: Repository<BetOption>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createBetOptionDto: CreateBetOptionDto): Promise<BetOption> {
    const event = await this.eventRepository.findOne({ 
      where: { id: createBetOptionDto.eventId } 
    });
    if (!event) throw new NotFoundException('Evento no encontrado');

    const betOption = this.betOptionRepository.create({
      label: createBetOptionDto.label,
      odds: createBetOptionDto.odds,
      event,
    });

    return this.betOptionRepository.save(betOption);
  }

  async findByEvent(eventId: number): Promise<BetOption[]> {
    return this.betOptionRepository.find({
      where: { event: { id: eventId } },
      relations: ['event'],
    });
  }
}
