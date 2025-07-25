import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

export class UserSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    // Verificar si ya existen usuarios
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log('Los usuarios ya existen, saltando seed...');
      return;
    }

    // Usuarios por defecto
    const defaultUsers = [
      {
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
      },
      {
        email: 'user1@example.com',
        password: await bcrypt.hash('password123', 10),
      },
      {
        email: 'user2@example.com',
        password: await bcrypt.hash('password456', 10),
      },
      {
        email: 'test@test.com',
        password: await bcrypt.hash('test123', 10),
      },
    ];

    // Crear los usuarios
    for (const userData of defaultUsers) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`Usuario creado: ${userData.email}`);
    }

    console.log('✅ Seed de usuarios completado');
  }
}
