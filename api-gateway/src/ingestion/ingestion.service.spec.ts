import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { ClientProxy } from '@nestjs/microservices';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { DocumentEntity } from '../document/document.entity';
import { NotFoundException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { IngestionResponseDto } from './dto/ingestion-response.dto';

describe('IngestionService', () => {
  let service: IngestionService;
  let ingestionClient: ClientProxy;
  let userRepository: Repository<UserEntity>;
  let documentRepository: Repository<DocumentEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: 'INGESTION_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOneByOrFail: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(DocumentEntity),
          useValue: {
            findOneByOrFail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    ingestionClient = module.get<ClientProxy>('INGESTION_SERVICE');
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    documentRepository = module.get<Repository<DocumentEntity>>(
      getRepositoryToken(DocumentEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(ingestionClient).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(documentRepository).toBeDefined();
  });

  describe('addIngestion', () => {
    it('should add a new ingestion and return the response', async () => {
      const createIngestionDto: CreateIngestionDto = { documentId: 123 };
      const userId = 1;
      const mockResponse: IngestionResponseDto = {
        id: 1,
        user: {
          id: userId,
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
        document: {
          id: 123,
          name: 'Test Document',
        },
        status: 'In Progress',
      };

      jest.spyOn(ingestionClient, 'send').mockReturnValue(of(mockResponse));

      const result = await service.addIngestion(createIngestionDto, userId);

      expect(ingestionClient.send).toHaveBeenCalledWith('add.ingestion', {
        userId,
        ...createIngestionDto,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if the ingestion client fails', async () => {
      const createIngestionDto: CreateIngestionDto = { documentId: 123 };
      const userId = 1;

      jest
        .spyOn(ingestionClient, 'send')
        .mockReturnValue(throwError(() => new Error('Client error')));

      await expect(
        service.addIngestion(createIngestionDto, userId),
      ).rejects.toThrow('Client error');
    });
  });

  describe('findIngestionById', () => {
    it('should return ingestion details by ID', async () => {
      const ingestionId = 1;
      const mockResponse = {
        ingestion: {
          id: ingestionId,
          userId: 1,
          documentId: 123,
          status: 'Completed',
        },
      };
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        roleId: 1,
        password: 'hashed-password',
      };
      const mockDocument = {
        id: 123,
        originalName: 'Test Document',
        name: 'Test Document',
        mimeType: 'application/pdf',
        uploadedAt: new Date(),
      };

      jest.spyOn(ingestionClient, 'send').mockReturnValue(of(mockResponse));
      jest
        .spyOn(userRepository, 'findOneByOrFail')
        .mockResolvedValue(mockUser as UserEntity);
      jest
        .spyOn(documentRepository, 'findOneByOrFail')
        .mockResolvedValue(mockDocument);

      const result = await service.findIngestionById(ingestionId);

      expect(ingestionClient.send).toHaveBeenCalledWith(
        'get.ingestion',
        ingestionId,
      );
      expect(userRepository.findOneByOrFail).toHaveBeenCalledWith({
        id: mockResponse.ingestion.userId,
      });
      expect(documentRepository.findOneByOrFail).toHaveBeenCalledWith({
        id: mockResponse.ingestion.documentId,
      });
      expect(result).toEqual({
        id: ingestionId,
        user: {
          id: mockUser.id,
          name: mockUser.firstName,
          email: mockUser.email,
        },
        document: {
          id: mockDocument.id,
          name: mockDocument.originalName,
        },
        status: mockResponse.ingestion.status,
      });
    });

    it('should throw NotFoundException if ingestion is not found', async () => {
      const ingestionId = 1;

      jest
        .spyOn(ingestionClient, 'send')
        .mockReturnValue(of({ ingestion: null }));

      await expect(service.findIngestionById(ingestionId)).rejects.toThrow(
        new NotFoundException(`Ingestion with ID ${ingestionId} not found`),
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      const ingestionId = 1;
      const mockResponse = {
        ingestion: {
          id: ingestionId,
          userId: 1,
          documentId: 123,
          status: 'Completed',
        },
      };

      jest.spyOn(ingestionClient, 'send').mockReturnValue(of(mockResponse));
      jest
        .spyOn(userRepository, 'findOneByOrFail')
        .mockRejectedValue(
          new NotFoundException(
            `User with ID ${mockResponse.ingestion.userId} not found`,
          ),
        );

      await expect(service.findIngestionById(ingestionId)).rejects.toThrow(
        new NotFoundException(
          `User with ID ${mockResponse.ingestion.userId} not found`,
        ),
      );
    });

    it('should throw NotFoundException if document is not found', async () => {
      const ingestionId = 1;
      const mockResponse = {
        ingestion: {
          id: ingestionId,
          userId: 1,
          documentId: 123,
          status: 'Completed',
        },
      };
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        roleId: 1,
        password: 'hashed-password',
      };

      jest.spyOn(ingestionClient, 'send').mockReturnValue(of(mockResponse));
      jest
        .spyOn(userRepository, 'findOneByOrFail')
        .mockResolvedValue(mockUser as UserEntity);
      jest
        .spyOn(documentRepository, 'findOneByOrFail')
        .mockRejectedValue(
          new NotFoundException(
            `Document with ID ${mockResponse.ingestion.documentId} not found`,
          ),
        );

      await expect(service.findIngestionById(ingestionId)).rejects.toThrow(
        new NotFoundException(
          `Document with ID ${mockResponse.ingestion.documentId} not found`,
        ),
      );
    });
  });
});
