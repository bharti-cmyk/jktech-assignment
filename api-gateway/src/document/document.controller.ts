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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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

@ApiTags('Documents') // Group all endpoints under "Documents"
@ApiBearerAuth() // Apply JWT authentication to all routes
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  /**
   * Upload a new document
   */
  @ApiOperation({ summary: 'Upload a document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Document file upload',
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

  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: AuthenticatedRequest,
  ) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    if (!file) {
      throw new Error('Please upload valid file');
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
  @ApiOperation({ summary: 'Retrieve a document by ID' })
  @ApiResponse({ status: 200, description: 'Returns the document as a stream' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getDocument(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const { userId } = req.user;

    const user = await this.documentService.getUserFromRequest(userId);

    const stream = await this.documentService.retrieveDocument(id, user);

    return new StreamableFile(stream);
  }

  /**
   * Update an existing document
   */
  @ApiOperation({ summary: 'Update an existing document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a new document to replace the existing one',
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
  @ApiResponse({ status: 200, description: 'Document updated successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateDocument(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: AuthenticatedRequest,
  ) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const { userId } = req.user;
    const user = await this.documentService.getUserFromRequest(userId);
    await this.documentService.updateDocument(id, file, user);

    return {
      message: 'Document updated successfully',
    };
  }

  /**
   * List all documents
   */
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({ status: 200, description: 'Returns a list of documents' })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async listDocuments(@Request() req: AuthenticatedRequest) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const { userId } = req.user;

    const user = await this.documentService.getUserFromRequest(userId);
    return this.documentService.listDocuments(user);
  }

  /**
   * Delete a document by ID
   */
  @ApiOperation({ summary: 'Delete a document by ID' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteDocument(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const { userId } = req.user;

    const user = await this.documentService.getUserFromRequest(userId);
    await this.documentService.deleteDocument(id, user);

    return {
      message: 'Document deleted successfully',
    };
  }
}
