import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { DatabaseSeeder } from './seeds/database.seed';

async function runSeeds() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    const seeder = new DatabaseSeeder();
    await seeder.run(dataSource);
    console.log('🎉 Seeds ejecutados exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando seeds:', error);
  } finally {
    await app.close();
  }
}

runSeeds();
