import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RolesGuard } from '../users/roles.guard';
import { CheckPermissions } from '../global/decorators/check-permission.decorator';
import { Action } from '../users/roles/role-permission.entity';

@ApiTags('Auth') // Groups all endpoints under "Auth"
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
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @CheckPermissions((ability) => ability.can(Action.WRITE, 'User'))
  create(@Body() createUserDto: any) {
    return this.authService.create(createUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @Get()
  @UseGuards(RolesGuard)
  @CheckPermissions((ability) => ability.can(Action.READ, 'User'))
  findAll() {
    return this.authService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  @UseGuards(RolesGuard)
  @CheckPermissions((ability) => ability.can(Action.READ, 'User'))
  findOne(@Param('id') id: number) {
    return this.authService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Delete(':id')
  @UseGuards(RolesGuard)
  @CheckPermissions((ability) => ability.can(Action.WRITE, 'User'))
  remove(@Param('id') id: number) {
    return this.authService.remove(id);
  }
}
