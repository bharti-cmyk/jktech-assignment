import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RolesGuard } from '../users/roles.guard';
import { CheckPermissions } from '../global/decorators/check-permission.decorator';
import { Action } from '../users/roles/role-permission.entity';
import { JwtAuthGuard } from './jwt.guard';
import { Roles } from '../users/roles.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    schema: {
      example: {
        username: 'superadmin@admin.com',
        password: 'Admin@123',
      },
    },
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({
    schema: {
      example: {
        firstName: 'John ',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'StrongPass123!',
        role: 'editor',
      },
    },
  })
  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  //@CheckPermissions((ability) => ability.can(Action.WRITE, 'User'))
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @Get()
  @UseGuards(JwtAuthGuard)
  //@CheckPermissions((ability) => ability.can(Action.READ, 'User'))
  findAllUser() {
    return this.authService.findAllUser();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  //@CheckPermissions((ability) => ability.can(Action.READ, 'User'))
  findOneUser(@Param('id') id: number) {
    const user = this.authService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Delete(':id')
  @UseGuards(RolesGuard)
  // @CheckPermissions((ability) => ability.can(Action.WRITE, 'User'))
  async deleteUser(@Param('id') id: number) {
    const userDeleted = await this.authService.remove(id);
    if(userDeleted.affected === 1) {
      return "User deleted successfully";
    }
  }
}
