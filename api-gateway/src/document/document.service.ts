import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream } from 'fs';
import { rm, stat } from 'fs/promises';
import { join } from 'path';
import { Repository } from 'typeorm';
import { DocumentEntity } from './document.entity';
import { convertBytes } from './utils/file';
import { AbilityFactory } from '../casl/ability.factory';
import { Action } from '../users/roles/role-permission.entity';
import { UserEntity } from '../users/users.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private documentRepository: Repository<DocumentEntity>,
    private readonly configService: ConfigService,
    private readonly abilityFactory: AbilityFactory,
    private readonly authService: AuthService,
  ) {}

  async create(file: Express.Multer.File, user: UserEntity) {
    const ability = this.abilityFactory.defineAbility(user);
    if (!ability.can(Action.WRITE, 'Document')) {
      throw new ForbiddenException(
        'You do not have permission to create documents',
      );
    }

    const newDocument = new DocumentEntity();
    newDocument.uploadedAt = new Date();
    newDocument.originalName = file.originalname;
    newDocument.name = file.filename;
    newDocument.mimeType = file.mimetype;

    try {
      return await this.documentRepository.save(newDocument);
    } catch (error) {
      await rm(file.path);
      throw new BadRequestException('Error saving document to the database');
    }
  }

  async getUserFromRequest(userId: number): Promise<UserEntity> {
    const user = await this.authService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getDocumentById(id: number, user: UserEntity) {
    const document = await this.documentRepository.findOne({ where: { id } });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const ability = this.abilityFactory.defineAbility(user);
    if (!ability.can(Action.READ, 'Document')) {
      throw new ForbiddenException(
        'You do not have permission to view this document',
      );
    }

    return document;
  }

  async retrieveDocument(id: number, user: UserEntity) {
    const document = await this.getDocumentById(id, user);
    const readStream = createReadStream(
      join(
        join(__dirname, this.configService.get('upload.path') as string),
        document.name,
      ),
    );
    return readStream;
  }

  async updateDocument(
    id: number,
    document: Express.Multer.File,
    user: UserEntity,
  ) {
    const oldDocument = await this.getDocumentById(id, user);
    const ability = this.abilityFactory.defineAbility(user);
    if (!ability.can(Action.UPDATE, 'Document')) {
      throw new ForbiddenException(
        'You do not have permission to update documents',
      );
    }

    const documentToDelete = oldDocument.name;
    oldDocument.originalName = document.originalname;
    oldDocument.name = document.filename;
    oldDocument.mimeType = document.mimetype;

    try {
      await this.documentRepository.save(oldDocument);
      await rm(
        join(
          join(__dirname, this.configService.get('upload.path') as string),
          documentToDelete,
        ),
      );
    } catch (error) {
      await rm(document.path);
      throw error;
    }
  }

  async deleteDocument(id: number, user: UserEntity) {
    const document = await this.getDocumentById(id, user);
    const ability = this.abilityFactory.defineAbility(user);
    if (!ability.can(Action.DELETE, 'Document')) {
      throw new ForbiddenException(
        'You do not have permission to delete documents',
      );
    }

    await rm(
      join(
        join(__dirname, this.configService.get('upload.path') as string),
        document.name,
      ),
    );
    await this.documentRepository.remove(document);
  }

  async getSizeOfDocument(path: string) {
    const stats = await stat(path);
    const size = stats.size;
    return convertBytes(size);
  }

  async listDocuments(user: UserEntity) {
    const ability = this.abilityFactory.defineAbility(user);

    if (!ability.can(Action.READ, 'Document')) {
      throw new ForbiddenException(
        'You do not have permission to view this document',
      );
    }
    const documents = await this.documentRepository.find();
    return Promise.all(
      documents.map(async (document) => {
        const documentSize = await this.getSizeOfDocument(
          join(
            join(__dirname, this.configService.get('upload.path') as string),
            document.name,
          ),
        );

        return {
          id: document.id,
          name: document.originalName,
          size: documentSize,
          uploadedAt: document.uploadedAt,
        };
      }),
    );
  }
}
