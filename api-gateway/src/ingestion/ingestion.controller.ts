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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CheckPermissions } from '../global/decorators/check-permission.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Action } from '../users/roles/role-permission.entity';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { IngestionService } from './ingestion.service';
import { Roles } from 'src/users/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';
import { IngestionResponseDto } from './dto/ingestion-response.dto';

interface AuthTokenPayload {
  userId: number;
  email: string;
  iat: number;
}
interface AuthenticatedRequest extends Request {
  user: AuthTokenPayload;
}

@ApiTags('Ingestion')
@ApiBearerAuth()
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  /**
   * Create a new ingestion record
   * @param createIngestionDto Ingestion data
   * @param req Authenticated request
   * @returns Created ingestion record
   */

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an ingestion record' })
  @ApiResponse({
    status: 201,
    description: 'Ingestion record created successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({
    schema: {
      example: {
        documentId: 123,
      },
    },
  })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createIngestion(
    @Body() createIngestionDto: CreateIngestionDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<IngestionResponseDto> {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const { userId } = req.user;
    return this.ingestionService.addIngestion(createIngestionDto, userId);
  }

  /**
   * Get ingestion status by ID
   * @param id Ingestion ID
   * @returns Ingestion status
   */

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an ingestion record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Ingestion record retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Ingestion record not found' })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @CheckPermissions((ability) => ability.can(Action.READ, 'Ingestion'))
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ingestionService.findIngestionById(id);
  }
}
