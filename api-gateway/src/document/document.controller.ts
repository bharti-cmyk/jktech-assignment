import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { CheckPermissions } from '../global/decorators/check-permission.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../users/roles.guard';
import { Action } from '../users/roles/role-permission.entity';
import { Roles } from '../users/roles.decorator';
import { DocumentService } from './document.service';

interface AuthTokenPayload {
  userId: number;
  email: string;
  iat: number;
}
interface AuthenticatedRequest extends Request {
  user: AuthTokenPayload;
}

@ApiTags('document')
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  /**
   * Upload a new document
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  @CheckPermissions((ability) => ability.can(Action.WRITE, 'Document'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: AuthenticatedRequest,
  ) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const { userId } = req.user;
    const user = await this.documentService.getUserFromRequest(userId);

    if (!user) {
      throw new Error('User not exist');
    }

    const document = await this.documentService.create(file, user);

    return {
      message: 'Document uploaded successfully',
      document: {
        id: document.id,
      },
    };
  }

  /**
   * Retrieve a document by ID
   */
  @Get(':id')
  @ApiBearerAuth()
  @CheckPermissions((ability) => ability.can(Action.READ, 'Document'))
  async getDocument(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const stream = await this.documentService.retrieveDocument(id, req.user);

    return new StreamableFile(stream);
  }

  /**
   * Update an existing document
   */
  @Put(':id')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a new document to update the existing one',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @CheckPermissions((ability) => ability.can(Action.UPDATE, 'Document'))
  async updateDocument(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    await this.documentService.updateDocument(id, file, req.user);

    return {
      message: 'Document updated successfully',
    };
  }

  /**
   * List all documents
   */
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @CheckPermissions((ability) => ability.can(Action.READ, 'Document'))
  async listDocuments(@Req() req: any) {
    return this.documentService.listDocuments(req.user);
  }

  /**
   * Delete a document by ID
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @CheckPermissions((ability) => ability.can(Action.DELETE, 'Document'))
  async deleteDocument(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    await this.documentService.deleteDocument(id, req.user);

    return {
      message: 'Document deleted successfully',
    };
  }
}
