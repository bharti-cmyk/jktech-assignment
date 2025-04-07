import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DocumentEntity } from './document.entity';
import { ConfigService } from '@nestjs/config';
import { AbilityFactory } from '../casl/ability.factory';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from '../users/users.entity';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { rm } from 'fs/promises';

jest.mock('fs/promises', () => ({
  ...jest.requireActual('fs/promises'),
  rm: jest.fn(), // Mock the `rm` function
}));

describe('DocumentService', () => {
  let service: DocumentService;
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
          useClass: Repository, // Mock the repository
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'upload.path') return 'uploads';
              return null;
            }),
          },
        },
        {
          provide: AbilityFactory,
          useValue: {
            defineAbility: jest.fn().mockReturnValue({
              can: jest.fn().mockReturnValue(true),
            }),
          },
        },
        {
          provide: AuthService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    documentRepository = module.get<Repository<DocumentEntity>>(
      getRepositoryToken(DocumentEntity),
    );
    authService = module.get<AuthService>(AuthService);
    abilityFactory = module.get<AbilityFactory>(AbilityFactory);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(documentRepository).toBeDefined();
    expect(authService).toBeDefined();
    expect(abilityFactory).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('getUserFromRequest', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: 1, email: 'test@example.com' } as UserEntity;
      jest.spyOn(authService, 'findById').mockResolvedValue(mockUser);

      const result = await service.getUserFromRequest(1);

      expect(authService.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(authService, 'findById').mockResolvedValue(null);

      await expect(service.getUserFromRequest(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a document', async () => {
      const mockFile = {
        originalname: 'test.pdf',
        filename: 'test.pdf',
        mimetype: 'application/pdf',
      } as Express.Multer.File;
      const mockUser = { id: 1 } as UserEntity;
      const mockDocument = { id: 1, name: 'test.pdf' } as DocumentEntity;

      jest.spyOn(documentRepository, 'save').mockResolvedValue(mockDocument);

      const result = await service.create(mockFile, mockUser);

      expect(documentRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          originalName: mockFile.originalname,
          name: mockFile.filename,
          mimeType: mockFile.mimetype,
        }),
      );
      expect(result).toEqual(mockDocument);
    });

    it('should throw ForbiddenException if user does not have permission', async () => {
      const mockAbility = {
        can: jest.fn().mockReturnValue(false),
      };

      jest
        .spyOn(abilityFactory, 'defineAbility')
        .mockReturnValue(mockAbility as any);

      const mockFile = {} as Express.Multer.File;
      const mockUser = {} as UserEntity;

      await expect(service.create(mockFile, mockUser)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException if saving fails', async () => {
      const mockFile = {
        originalname: 'test.pdf',
        filename: 'test.pdf',
        mimetype: 'application/pdf',
        path: 'test-path',
      } as Express.Multer.File;

      const mockUser = { id: 1 } as UserEntity;

      jest.spyOn(documentRepository, 'save').mockRejectedValue(new Error());
      (rm as jest.Mock).mockResolvedValue(undefined); // Mock `rm` to prevent file system errors

      await expect(service.create(mockFile, mockUser)).rejects.toThrow(
        BadRequestException,
      );

      expect(rm).toHaveBeenCalledWith('test-path'); // Ensure `rm` is called with the correct path
    });
  });

  describe('getDocumentById', () => {
    it('should return a document if found', async () => {
      const mockDocument = { id: 1, name: 'test.pdf' } as DocumentEntity;
      jest.spyOn(documentRepository, 'findOne').mockResolvedValue(mockDocument);

      const result = await service.getDocumentById(1, {} as UserEntity);

      expect(documentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockDocument);
    });

    it('should throw NotFoundException if document is not found', async () => {
      jest.spyOn(documentRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.getDocumentById(1, {} as UserEntity),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not have permission', async () => {
      const mockAbility = {
        can: jest.fn().mockReturnValue(false), // Mock the `can` method
        cannot: jest.fn(), // Add other required methods if necessary
        relevantRuleFor: jest.fn(),
        _hasPerFieldRules: false,
        _indexedRules: [],
      };

      jest
        .spyOn(abilityFactory, 'defineAbility')
        .mockReturnValue(mockAbility as any);

      const mockDocument = { id: 1, name: 'test.pdf' } as DocumentEntity;
      jest.spyOn(documentRepository, 'findOne').mockResolvedValue(mockDocument);

      await expect(
        service.getDocumentById(1, {} as UserEntity),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      const mockDocument = { id: 1, name: 'test.pdf' } as DocumentEntity;
      jest.spyOn(service, 'getDocumentById').mockResolvedValue(mockDocument);
      jest.spyOn(documentRepository, 'remove').mockResolvedValue(mockDocument);

      await service.deleteDocument(1, {} as UserEntity);

      expect(service.getDocumentById).toHaveBeenCalledWith(1, {});
      expect(documentRepository.remove).toHaveBeenCalledWith(mockDocument);
    });
  });
});
