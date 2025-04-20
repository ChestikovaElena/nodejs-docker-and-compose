import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HashModule } from '../hash/hash.module';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategy/local-strategy';
import { JwtStrategy } from './strategy/jwt-strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    HashModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
