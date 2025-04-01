import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RolesGuard } from '../users/roles.guard';
import { Roles } from '../users/roles.decorator';
import { CheckPermissions } from '../global/decorators/check-permission.decorator';
import { Action } from '../users/roles/role-permission.entity';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  // @UseGuards(RolesGuard)
  // @Roles('admin')
  create(@Body() createUserDto: any) {
    return this.authService.create(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @CheckPermissions((ability) => ability.can(Action.READ, 'User'))
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @CheckPermissions((ability) => ability.can(Action.READ, 'User'))
  findOne(@Param('id') id: number) {
    return this.authService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @CheckPermissions((ability) => ability.can(Action.WRITE, 'User'))
  remove(@Param('id') id: number) {
    return this.authService.remove(id);
  }
}
