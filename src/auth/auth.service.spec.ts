import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto, LoginDto } from '../users/dto/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    bets: [],
  };

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);

    // Mock bcrypt
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password123',
      };

      const savedUser = { ...mockUser, ...createUserDto, password: 'hashedPassword' };

      userRepository.create.mockReturnValue(savedUser as any);
      userRepository.save.mockResolvedValue(savedUser as any);
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });
      expect(userRepository.save).toHaveBeenCalledWith(savedUser);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: savedUser.id,
        email: savedUser.email
      });
      expect(result).toEqual({
        user: { id: 1, email: 'test@test.com', createdAt: mockUser.createdAt, bets: [] },
        token: 'jwt-token',
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'password123',
      };

      userRepository.findOne.mockResolvedValue(mockUser as any);
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email }
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email
      });
      expect(result).toEqual({
        user: { id: 1, email: 'test@test.com', createdAt: mockUser.createdAt, bets: [] },
        token: 'jwt-token',
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'wrongpassword',
      };

      userRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'wrongpassword',
      };

      userRepository.findOne.mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return user profile without password', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as any);

      const result = await service.getProfile(1);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({
        id: 1,
        email: 'test@test.com',
        createdAt: mockUser.createdAt,
        bets: [],
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile(999)).rejects.toThrow(NotFoundException);
    });
  });
});
