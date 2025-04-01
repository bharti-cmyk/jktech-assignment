import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module'; // Import UsersModule
import { UserEntity } from '../users/users.entity'; // Import User entity
import { RoleEntity } from '../users/roles/roles.entity';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    UsersModule, // Ensure UsersModule is available
    TypeOrmModule.forFeature([UserEntity, RoleEntity]), // Register User entity for database access
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET', { infer: true }) ||
          'default-secret',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
