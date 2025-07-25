import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ['betOptions'],
      order: { startTime: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['betOptions'],
    });
    if (!event) throw new NotFoundException('Evento no encontrado');
    return event;
  }

  async findBySport(sport: string): Promise<Event[]> {
    return this.eventRepository.find({
      where: { sport },
      relations: ['betOptions'],
      order: { startTime: 'ASC' }
    });
  }

  async findByStatus(status: string): Promise<Event[]> {
    return this.eventRepository.find({
      where: { status },
      relations: ['betOptions'],
      order: { startTime: 'ASC' }
    });
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    await this.eventRepository.update(id, updateEventDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.eventRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Evento no encontrado');
  }
}
