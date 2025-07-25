import { DataSource } from 'typeorm';
import { Event } from '../../events/entities/event.entity';

export class EventSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const eventRepository = dataSource.getRepository(Event);

    // Verificar si ya existen eventos
    const existingEvents = await eventRepository.count();
    if (existingEvents > 0) {
      console.log('Los eventos ya existen, saltando seed...');
      return;
    }

    // Eventos deportivos por defecto
    const defaultEvents = [
      {
        sport: 'Fútbol',
        title: 'Real Madrid vs Barcelona',
        startTime: new Date('2025-07-30T20:00:00'),
        status: 'upcoming',
      },
      {
        sport: 'Fútbol',
        title: 'Manchester United vs Liverpool',
        startTime: new Date('2025-07-28T15:30:00'),
        status: 'upcoming',
      },
      {
        sport: 'Baloncesto',
        title: 'Lakers vs Warriors',
        startTime: new Date('2025-07-26T21:00:00'),
        status: 'upcoming',
      },
      {
        sport: 'Tenis',
        title: 'Wimbledon Final - Djokovic vs Alcaraz',
        startTime: new Date('2025-07-27T14:00:00'),
        status: 'upcoming',
      },
      {
        sport: 'Fútbol',
        title: 'Boca Juniors vs River Plate',
        startTime: new Date('2025-07-25T19:00:00'),
        status: 'live',
      },
      {
        sport: 'Baloncesto',
        title: 'Bulls vs Celtics',
        startTime: new Date('2025-07-29T20:30:00'),
        status: 'upcoming',
      },
    ];

    // Crear los eventos
    for (const eventData of defaultEvents) {
      const event = eventRepository.create(eventData);
      await eventRepository.save(event);
      console.log(`Evento creado: ${eventData.title}`);
    }

    console.log('✅ Seed de eventos completado');
  }
}
