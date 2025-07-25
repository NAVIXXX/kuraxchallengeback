import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { CreateUserDto, LoginDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ user: Omit<User, 'password'>, token: string }> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    const token = this.jwtService.sign({ sub: savedUser.id, email: savedUser.email });

    const { password, ...userWithoutPassword } = savedUser;
    return { user: userWithoutPassword, token };
  }

  async login(loginDto: LoginDto): Promise<{ user: Omit<User, 'password'>, token: string }> {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getProfile(userId: number): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
