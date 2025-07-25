import { DataSource } from 'typeorm';
import { UserSeeder } from './user.seed';
import { EventSeeder } from './event.seed';
import { BetOptionSeeder } from './bet-option.seed';
import { BetSeeder } from './bet.seed';

export class DatabaseSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('🌱 Iniciando seeds...');

    // 1. Ejecutar seed de usuarios (primero)
    const userSeeder = new UserSeeder();
    await userSeeder.run(dataSource);

    // 2. Ejecutar seed de eventos (segundo)
    const eventSeeder = new EventSeeder();
    await eventSeeder.run(dataSource);

    // 3. Ejecutar seed de opciones de apuesta (tercero - necesita eventos)
    const betOptionSeeder = new BetOptionSeeder();
    await betOptionSeeder.run(dataSource);

    // 4. Ejecutar seed de apuestas (último - necesita usuarios, eventos y opciones)
    const betSeeder = new BetSeeder();
    await betSeeder.run(dataSource);

    console.log('✅ Todos los seeds completados');
  }
}
