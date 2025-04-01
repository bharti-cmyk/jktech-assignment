import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { Repository } from 'typeorm';
import { DocumentEntity } from './document.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AbilityFactory } from '../casl/ability.factory';
import { AuthService } from '../auth/auth.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserEntity } from '../users/users.entity';

// Mocking the fs/promises module
jest.mock('fs/promises', () => ({
  rm: jest.fn().mockResolvedValue(undefined), // Mock the rm function
}));

describe('DocumentService', () => {
  let documentService: DocumentService;
  let documentRepository: Repository<DocumentEntity>;
  let authService: AuthService;
  let abilityFactory: AbilityFactory;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(DocumentEntity),
          useClass: Repository,
        },
        {
          provide: AuthService,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: AbilityFactory,
          useValue: {
            defineAbility: jest.fn(() => ({ can: jest.fn(() => true) })),
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('/uploads') },
        },
      ],
    }).compile();

    documentService = module.get<DocumentService>(DocumentService);
    documentRepository = module.get<Repository<DocumentEntity>>(
      getRepositoryToken(DocumentEntity),
    );
    authService = module.get<AuthService>(AuthService);
    abilityFactory = module.get<AbilityFactory>(AbilityFactory);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(documentService).toBeDefined();
  });

  describe('getDocumentById', () => {
    it('should return a document if found', async () => {
      const mockDocument = { id: 1, name: 'file.txt' } as DocumentEntity;
      jest.spyOn(documentRepository, 'findOne').mockResolvedValue(mockDocument);

      const result = await documentService.getDocumentById(1, {} as UserEntity);
      expect(result).toEqual(mockDocument);
    });

    it('should throw NotFoundException if document does not exist', async () => {
      jest.spyOn(documentRepository, 'findOne').mockResolvedValue(null);

      await expect(
        documentService.getDocumentById(1, {} as UserEntity),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      const mockDocument = { id: 1, name: 'file.txt' } as DocumentEntity;
      jest.spyOn(documentRepository, 'findOne').mockResolvedValue(mockDocument);
      jest.spyOn(documentRepository, 'remove').mockResolvedValue(mockDocument);

      // No need to spy on rm since it's already mocked globally in jest.mock()

      await expect(
        documentService.deleteDocument(1, {} as UserEntity),
      ).resolves.not.toThrow();
      expect(require('fs/promises').rm).toHaveBeenCalledWith(
        '/uploads/file.txt',
      );
    });

    it('should throw NotFoundException if document does not exist', async () => {
      jest.spyOn(documentRepository, 'findOne').mockResolvedValue(null);
      await expect(
        documentService.deleteDocument(1, {} as UserEntity),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
