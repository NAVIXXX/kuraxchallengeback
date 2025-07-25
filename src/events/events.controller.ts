import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  // Endpoint público para mostrar eventos deportivos
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  // Endpoint público para ver detalles de un evento
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  // Endpoint para obtener eventos por deporte
  @Get('sport/:sport')
  findBySport(@Param('sport') sport: string) {
    return this.eventsService.findBySport(sport);
  }

  // Endpoint para obtener eventos en vivo
  @Get('status/live')
  findLiveEvents() {
    return this.eventsService.findByStatus('live');
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.eventsService.remove(id);
    return { message: 'Evento eliminado' };
  }
}
