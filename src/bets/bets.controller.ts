import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createBetDto: CreateBetDto) {
    return this.betsService.create(req.user.userId, createBetDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.betsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  findUserBets(@Request() req) {
    return this.betsService.findUserBets(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.betsService.findOne(id);
  }
}
