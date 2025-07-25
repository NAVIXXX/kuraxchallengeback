import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

describe('EventsService', () => {
  let service: EventsService;
  let eventRepository: jest.Mocked<Repository<Event>>;

  const mockEvent = {
    id: 1,
    sport: 'football',
    title: 'Team A vs Team B',
    startTime: new Date('2024-12-31T20:00:00Z'),
    status: 'upcoming',
    betOptions: [],
  };

  beforeEach(async () => {
    const mockEventRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventRepository = module.get(getRepositoryToken(Event));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new event successfully', async () => {
      const createEventDto: CreateEventDto = {
        sport: 'football',
        title: 'Team A vs Team B',
        startTime: new Date('2024-12-31T20:00:00Z'),
        status: 'upcoming',
      };

      eventRepository.create.mockReturnValue(mockEvent as any);
      eventRepository.save.mockResolvedValue(mockEvent as any);

      const result = await service.create(createEventDto);

      expect(eventRepository.create).toHaveBeenCalledWith(createEventDto);
      expect(eventRepository.save).toHaveBeenCalledWith(mockEvent);
      expect(result).toEqual(mockEvent);
    });
  });

  describe('findAll', () => {
    it('should return all events with bet options', async () => {
      const events = [mockEvent, { ...mockEvent, id: 2, title: 'Team C vs Team D' }];
      eventRepository.find.mockResolvedValue(events as any);

      const result = await service.findAll();

      expect(eventRepository.find).toHaveBeenCalledWith({
        relations: ['betOptions'],
        order: { startTime: 'ASC' }
      });
      expect(result).toEqual(events);
    });
  });

  describe('findOne', () => {
    it('should return event by id with bet options', async () => {
      eventRepository.findOne.mockResolvedValue(mockEvent as any);

      const result = await service.findOne(1);

      expect(eventRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['betOptions'],
      });
      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException if event not found', async () => {
      eventRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Evento no encontrado');
    });
  });

  describe('findBySport', () => {
    it('should return events filtered by sport', async () => {
      const footballEvents = [mockEvent];
      eventRepository.find.mockResolvedValue(footballEvents as any);

      const result = await service.findBySport('football');

      expect(eventRepository.find).toHaveBeenCalledWith({
        where: { sport: 'football' },
        relations: ['betOptions'],
        order: { startTime: 'ASC' }
      });
      expect(result).toEqual(footballEvents);
    });
  });

  describe('findByStatus', () => {
    it('should return events filtered by status', async () => {
      const upcomingEvents = [mockEvent];
      eventRepository.find.mockResolvedValue(upcomingEvents as any);

      const result = await service.findByStatus('upcoming');

      expect(eventRepository.find).toHaveBeenCalledWith({
        where: { status: 'upcoming' },
        relations: ['betOptions'],
        order: { startTime: 'ASC' }
      });
      expect(result).toEqual(upcomingEvents);
    });
  });
});
