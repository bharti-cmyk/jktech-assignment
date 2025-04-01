import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { DocumentEntity } from './document.entity';
import { AbilityFactory } from '../casl/ability.factory';
import { UserEntity } from '../users/users.entity';
import { AuthService } from '../auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RoleEntity } from '../users/roles/roles.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity, UserEntity, RoleEntity]),
    ConfigModule, // ✅ Import ConfigModule for global access
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
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, './uploads'), // Save to 'uploads' folder
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  ],
  controllers: [DocumentController],
  providers: [DocumentService, AbilityFactory, AuthService, UsersService],
  exports: [DocumentService],
})
export class DocumentModule {}
