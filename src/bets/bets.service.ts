import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bet } from './entities/bet.entity';
import { Event } from '../events/entities/event.entity';
import { BetOption } from '../bet-options/entities/bet-option.entity';
import { User } from '../users/entities/user.entity';
import { CreateBetDto } from './dto/create-bet.dto';

@Injectable()
export class BetsService {
  constructor(
    @InjectRepository(Bet)
    private readonly betRepository: Repository<Bet>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(BetOption)
    private readonly betOptionRepository: Repository<BetOption>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: number, createBetDto: CreateBetDto): Promise<Bet> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const event = await this.eventRepository.findOne({ where: { id: createBetDto.eventId } });
    if (!event) throw new NotFoundException('Evento no encontrado');

    const betOption = await this.betOptionRepository.findOne({
      where: { id: createBetDto.betOptionId },
      relations: ['event']
    });
    if (!betOption) throw new NotFoundException('Opción de apuesta no encontrada');

    if (betOption.event.id !== createBetDto.eventId) {
      throw new BadRequestException('La opción de apuesta no pertenece al evento especificado');
    }

    const potentialWinnings = createBetDto.amount * betOption.odds;

    const bet = this.betRepository.create({
      user,
      event,
      betOption,
      amount: createBetDto.amount,
      potentialWinnings,
    });

    return this.betRepository.save(bet);
  }

  async findAll(): Promise<Bet[]> {
    return this.betRepository.find({
      relations: ['user', 'event', 'betOption'],
    });
  }

  async findUserBets(userId: number): Promise<Bet[]> {
    return this.betRepository.find({
      where: { user: { id: userId } },
      relations: ['event', 'betOption'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Bet> {
    const bet = await this.betRepository.findOne({
      where: { id },
      relations: ['user', 'event', 'betOption'],
    });
    if (!bet) throw new NotFoundException('Apuesta no encontrada');
    return bet;
  }
}
