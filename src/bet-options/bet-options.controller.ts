import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { BetOptionsService } from './bet-options.service';
import { CreateBetOptionDto } from './dto/create-bet-option.dto';

@Controller('bet-options')
export class BetOptionsController {
  constructor(private readonly betOptionsService: BetOptionsService) {}

  @Post()
  create(@Body() createBetOptionDto: CreateBetOptionDto) {
    return this.betOptionsService.create(createBetOptionDto);
  }

  @Get('event/:eventId')
  findByEvent(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.betOptionsService.findByEvent(eventId);
  }
}
