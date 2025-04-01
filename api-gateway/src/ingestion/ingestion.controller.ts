import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CheckPermissions } from '../global/decorators/check-permission.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../users/roles.guard';
import { Action } from '../users/roles/role-permission.entity';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { IngestionService } from './ingestion.service';

interface AuthTokenPayload {
  userId: number;
  email: string;
  iat: number;
}
interface AuthenticatedRequest extends Request {
  user: AuthTokenPayload;
}

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @CheckPermissions((ability) => ability.can(Action.WRITE, 'Ingestion'))
  create(
    @Body() createIngestionDto: CreateIngestionDto,
    @Request() req: AuthenticatedRequest,
  ) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const { userId } = req.user;
    return this.ingestionService.addIngestion(createIngestionDto, userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @CheckPermissions((ability) => ability.can(Action.READ, 'Ingestion'))
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ingestionService.findIngestionById(id);
  }
}
