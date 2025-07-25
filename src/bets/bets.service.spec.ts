import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { BetsService } from './bets.service';
import { Bet } from './entities/bet.entity';
import { Event } from '../events/entities/event.entity';
import { BetOption } from '../bet-options/entities/bet-option.entity';
import { User } from '../users/entities/user.entity';
import { CreateBetDto } from './dto/create-bet.dto';

describe('BetsService', () => {
  let service: BetsService;
  let betRepository: jest.Mocked<Repository<Bet>>;
  let eventRepository: jest.Mocked<Repository<Event>>;
  let betOptionRepository: jest.Mocked<Repository<BetOption>>;
  let userRepository: jest.Mocked<Repository<User>>;

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    bets: [],
  };

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

  const mockBet = {
    id: 1,
    user: mockUser,
    event: mockEvent,
    betOption: mockBetOption,
    amount: 100,
    potentialWinnings: 175,
    status: 'pending',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const mockBetRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const mockEventRepository = {
      findOne: jest.fn(),
    };

    const mockBetOptionRepository = {
      findOne: jest.fn(),
    };

    const mockUserRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BetsService,
        {
          provide: getRepositoryToken(Bet),
          useValue: mockBetRepository,
        },
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository,
        },
        {
          provide: getRepositoryToken(BetOption),
          useValue: mockBetOptionRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<BetsService>(BetsService);
    betRepository = module.get(getRepositoryToken(Bet));
    eventRepository = module.get(getRepositoryToken(Event));
    betOptionRepository = module.get(getRepositoryToken(BetOption));
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new bet successfully', async () => {
      const createBetDto: CreateBetDto = {
        eventId: 1,
        betOptionId: 1,
        amount: 100,
      };

      userRepository.findOne.mockResolvedValue(mockUser as any);
      eventRepository.findOne.mockResolvedValue(mockEvent as any);
      betOptionRepository.findOne.mockResolvedValue(mockBetOption as any);
      betRepository.create.mockReturnValue(mockBet as any);
      betRepository.save.mockResolvedValue(mockBet as any);

      const result = await service.create(1, createBetDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(eventRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(betOptionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['event']
      });
      expect(betRepository.create).toHaveBeenCalledWith({
        user: mockUser,
        event: mockEvent,
        betOption: mockBetOption,
        amount: 100,
        potentialWinnings: 175,
      });
      expect(betRepository.save).toHaveBeenCalledWith(mockBet);
      expect(result).toEqual(mockBet);
    });

    it('should throw NotFoundException if user not found', async () => {
      const createBetDto: CreateBetDto = {
        eventId: 1,
        betOptionId: 1,
        amount: 100,
      };

      userRepository.findOne.mockResolvedValue(null);

      await expect(service.create(999, createBetDto)).rejects.toThrow(NotFoundException);
      await expect(service.create(999, createBetDto)).rejects.toThrow('Usuario no encontrado');
    });

    it('should throw NotFoundException if event not found', async () => {
      const createBetDto: CreateBetDto = {
        eventId: 999,
        betOptionId: 1,
        amount: 100,
      };

      userRepository.findOne.mockResolvedValue(mockUser as any);
      eventRepository.findOne.mockResolvedValue(null);

      await expect(service.create(1, createBetDto)).rejects.toThrow(NotFoundException);
      await expect(service.create(1, createBetDto)).rejects.toThrow('Evento no encontrado');
    });

    it('should throw NotFoundException if bet option not found', async () => {
      const createBetDto: CreateBetDto = {
        eventId: 1,
        betOptionId: 999,
        amount: 100,
      };

      userRepository.findOne.mockResolvedValue(mockUser as any);
      eventRepository.findOne.mockResolvedValue(mockEvent as any);
      betOptionRepository.findOne.mockResolvedValue(null);

      await expect(service.create(1, createBetDto)).rejects.toThrow(NotFoundException);
      await expect(service.create(1, createBetDto)).rejects.toThrow('Opción de apuesta no encontrada');
    });

    it('should throw BadRequestException if bet option does not belong to event', async () => {
      const createBetDto: CreateBetDto = {
        eventId: 1,
        betOptionId: 1,
        amount: 100,
      };

      const differentEvent = { ...mockEvent, id: 2 };
      const betOptionFromDifferentEvent = { ...mockBetOption, event: differentEvent };

      userRepository.findOne.mockResolvedValue(mockUser as any);
      eventRepository.findOne.mockResolvedValue(mockEvent as any);
      betOptionRepository.findOne.mockResolvedValue(betOptionFromDifferentEvent as any);

      await expect(service.create(1, createBetDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(1, createBetDto)).rejects.toThrow('La opción de apuesta no pertenece al evento especificado');
    });
  });
});
