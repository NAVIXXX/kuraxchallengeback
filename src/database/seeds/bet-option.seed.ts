import { DataSource } from 'typeorm';
import { BetOption } from '../../bet-options/entities/bet-option.entity';
import { Event } from '../../events/entities/event.entity';

export class BetOptionSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const betOptionRepository = dataSource.getRepository(BetOption);
    const eventRepository = dataSource.getRepository(Event);

    // Verificar si ya existen opciones de apuesta
    const existingBetOptions = await betOptionRepository.count();
    if (existingBetOptions > 0) {
      console.log('Las opciones de apuesta ya existen, saltando seed...');
      return;
    }

    // Obtener eventos existentes
    const events = await eventRepository.find();
    if (events.length === 0) {
      console.log('No hay eventos disponibles para crear opciones de apuesta');
      return;
    }

    // Crear opciones de apuesta para cada evento
    for (const event of events) {
      let betOptions: Array<{ event: Event; label: string; odds: number }> = [];

      if (event.sport === 'Fútbol') {
        betOptions = [
          {
            event,
            label: 'Victoria Local',
            odds: 2.1,
          },
          {
            event,
            label: 'Empate',
            odds: 3.2,
          },
          {
            event,
            label: 'Victoria Visitante',
            odds: 2.8,
          },
          {
            event,
            label: 'Más de 2.5 goles',
            odds: 1.8,
          },
          {
            event,
            label: 'Menos de 2.5 goles',
            odds: 2.0,
          },
        ];
      } else if (event.sport === 'Baloncesto') {
        betOptions = [
          {
            event,
            label: 'Victoria Local',
            odds: 1.9,
          },
          {
            event,
            label: 'Victoria Visitante',
            odds: 1.9,
          },
          {
            event,
            label: 'Más de 210.5 puntos',
            odds: 1.85,
          },
          {
            event,
            label: 'Menos de 210.5 puntos',
            odds: 1.95,
          },
        ];
      } else if (event.sport === 'Tenis') {
        betOptions = [
          {
            event,
            label: 'Victoria Jugador 1',
            odds: 1.6,
          },
          {
            event,
            label: 'Victoria Jugador 2',
            odds: 2.4,
          },
          {
            event,
            label: 'Más de 3.5 sets',
            odds: 2.1,
          },
          {
            event,
            label: 'Menos de 3.5 sets',
            odds: 1.7,
          },
        ];
      }

      // Crear las opciones de apuesta
      for (const betOptionData of betOptions) {
        const betOption = betOptionRepository.create(betOptionData);
        await betOptionRepository.save(betOption);
        console.log(`Opción de apuesta creada: ${betOptionData.label} para ${event.title}`);
      }
    }

    console.log('✅ Seed de opciones de apuesta completado');
  }
}
