import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BetOptionsService } from './bet-options.service';
import { BetOption } from './entities/bet-option.entity';
import { Event } from '../events/entities/event.entity';
import { CreateBetOptionDto } from './dto/create-bet-option.dto';

describe('BetOptionsService', () => {
  let service: BetOptionsService;
  let betOptionRepository: jest.Mocked<Repository<BetOption>>;
  let eventRepository: jest.Mocked<Repository<Event>>;

  const mockEvent = {
    id: 1,
    sport: 'football',
    title: 'Team A vs Team B',
    startTime: new Date('2024-12-31T20:00:00Z'),
    status: 'upcoming',
    betOptions: [],
  };

  const mockBetOption = {
    id: 1,
    label: 'Team A to win',
    odds: 1.75,
    event: mockEvent,
  };

  beforeEach(async () => {
    const mockBetOptionRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const mockEventRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BetOptionsService,
        {
          provide: getRepositoryToken(BetOption),
          useValue: mockBetOptionRepository,
        },
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<BetOptionsService>(BetOptionsService);
    betOptionRepository = module.get(getRepositoryToken(BetOption));
    eventRepository = module.get(getRepositoryToken(Event));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new bet option successfully', async () => {
      const createBetOptionDto: CreateBetOptionDto = {
        eventId: 1,
        label: 'Team A to win',
        odds: 1.75,
      };

      eventRepository.findOne.mockResolvedValue(mockEvent as any);
      betOptionRepository.create.mockReturnValue(mockBetOption as any);
      betOptionRepository.save.mockResolvedValue(mockBetOption as any);

      const result = await service.create(createBetOptionDto);

      expect(eventRepository.findOne).toHaveBeenCalledWith({
        where: { id: createBetOptionDto.eventId }
      });
      expect(betOptionRepository.create).toHaveBeenCalledWith({
        label: createBetOptionDto.label,
        odds: createBetOptionDto.odds,
        event: mockEvent,
      });
      expect(betOptionRepository.save).toHaveBeenCalledWith(mockBetOption);
      expect(result).toEqual(mockBetOption);
    });

    it('should throw NotFoundException if event not found', async () => {
      const createBetOptionDto: CreateBetOptionDto = {
        eventId: 999,
        label: 'Team A to win',
        odds: 1.75,
      };

      eventRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createBetOptionDto)).rejects.toThrow(NotFoundException);
      await expect(service.create(createBetOptionDto)).rejects.toThrow('Evento no encontrado');
    });
  });

  describe('findByEvent', () => {
    it('should return bet options for a specific event', async () => {
      const betOptions = [mockBetOption, { ...mockBetOption, id: 2, label: 'Team B to win' }];
      betOptionRepository.find.mockResolvedValue(betOptions as any);

      const result = await service.findByEvent(1);

      expect(betOptionRepository.find).toHaveBeenCalledWith({
        where: { event: { id: 1 } },
        relations: ['event'],
      });
      expect(result).toEqual(betOptions);
    });

    it('should return empty array if no bet options found for event', async () => {
      betOptionRepository.find.mockResolvedValue([]);

      const result = await service.findByEvent(999);

      expect(result).toEqual([]);
    });
  });
});
