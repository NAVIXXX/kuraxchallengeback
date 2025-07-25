import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BetsModule } from './bets/bets.module';
import { BetOptionsModule } from './bet-options/bet-options.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => typeOrmConfig(configService),
    }),
    AuthModule,
    UsersModule,
    EventsModule,
    BetOptionsModule,
    BetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
