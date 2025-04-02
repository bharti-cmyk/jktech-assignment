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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
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

@ApiTags('Ingestion')
@ApiBearerAuth()
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @CheckPermissions((ability) => ability.can(Action.WRITE, 'Ingestion'))
  @ApiOperation({ summary: 'Create an ingestion record' })
  @ApiResponse({ status: 201, description: 'Ingestion record created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({
    schema: {
      example: {
        documentId: 123
      },
    },
  })
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

  @ApiOperation({ summary: 'Get an ingestion record by ID' })
  @ApiResponse({ status: 200, description: 'Ingestion record retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Ingestion record not found' })
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @CheckPermissions((ability) => ability.can(Action.READ, 'Ingestion'))
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ingestionService.findIngestionById(id);
  }
}
