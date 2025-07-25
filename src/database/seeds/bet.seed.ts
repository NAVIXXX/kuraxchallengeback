import { DataSource } from 'typeorm';
import { Bet } from '../../bets/entities/bet.entity';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';
import { BetOption } from '../../bet-options/entities/bet-option.entity';

export class BetSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const betRepository = dataSource.getRepository(Bet);
    const userRepository = dataSource.getRepository(User);
    const eventRepository = dataSource.getRepository(Event);
    const betOptionRepository = dataSource.getRepository(BetOption);

    // Verificar si ya existen apuestas
    const existingBets = await betRepository.count();
    if (existingBets > 0) {
      console.log('Las apuestas ya existen, saltando seed...');
      return;
    }

    // Obtener usuarios, eventos y opciones de apuesta
    const users = await userRepository.find();
    const events = await eventRepository.find();
    const betOptions = await betOptionRepository.find({ relations: ['event'] });

    if (users.length === 0 || events.length === 0 || betOptions.length === 0) {
      console.log('No hay suficientes datos para crear apuestas (usuarios, eventos, opciones)');
      return;
    }

    // Apuestas de ejemplo para diferentes usuarios
    const exampleBets = [
      // Usuario admin apuesta en Real Madrid vs Barcelona
      {
        userId: 1, // admin@example.com
        eventId: 1,
        betOptionLabel: 'Victoria Local',
        amount: 50.00,
      },
      {
        userId: 1,
        eventId: 1,
        betOptionLabel: 'Más de 2.5 goles',
        amount: 25.00,
      },
      // Usuario 1 apuesta en Lakers vs Warriors
      {
        userId: 2, // user1@example.com
        eventId: 3,
        betOptionLabel: 'Victoria Local',
        amount: 100.00,
      },
      {
        userId: 2,
        eventId: 3,
        betOptionLabel: 'Más de 210.5 puntos',
        amount: 75.00,
      },
      // Usuario test apuesta en múltiples eventos
      {
        userId: 4, // test@test.com
        eventId: 2,
        betOptionLabel: 'Victoria Visitante',
        amount: 30.00,
      },
      {
        userId: 4,
        eventId: 4,
        betOptionLabel: 'Victoria Jugador 1',
        amount: 40.00,
      },
      {
        userId: 4,
        eventId: 5,
        betOptionLabel: 'Victoria Local',
        amount: 60.00,
      },
      // Usuario 2 apuesta conservadoramente
      {
        userId: 3, // user2@example.com
        eventId: 1,
        betOptionLabel: 'Empate',
        amount: 20.00,
      },
    ];

    // Crear las apuestas
    for (const betData of exampleBets) {
      const user = users.find(u => u.id === betData.userId);
      const event = events.find(e => e.id === betData.eventId);

      if (!user || !event) continue;

      // Buscar la opción de apuesta específica
      const betOption = betOptions.find(bo =>
        bo.event.id === betData.eventId &&
        bo.label === betData.betOptionLabel
      );

      if (!betOption) continue;

      const potentialWinnings = betData.amount * betOption.odds;

      const bet = betRepository.create({
        user,
        event,
        betOption,
        amount: betData.amount,
        potentialWinnings,
        status: 'pending', // todas empiezan como pendientes
      });

      await betRepository.save(bet);
      console.log(`Apuesta creada: ${user.email} apostó $${betData.amount} en "${betOption.label}" para ${event.title}`);
    }

    console.log('✅ Seed de apuestas completado');
  }
}
