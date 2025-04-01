import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './users.entity';
import { RolesGuard } from './roles.guard';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ClsModule.forRoot({ global: true }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
