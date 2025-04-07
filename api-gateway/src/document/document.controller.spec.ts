import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../users/roles.guard';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../users/users.entity';
import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';

describe('DocumentController', () => {
  let controller: DocumentController;
  let service: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: {
            create: jest.fn(),
            getUserFromRequest: jest.fn(),
            retrieveDocument: jest.fn(),
            updateDocument: jest.fn(),
            listDocuments: jest.fn(),
            deleteDocument: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<DocumentController>(DocumentController);
    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('uploadDocument', () => {
    it('should upload a document', async () => {
      const mockFile = {
        originalname: 'test.pdf',
        filename: 'test.pdf',
        mimetype: 'application/pdf',
      } as Express.Multer.File;

      const mockUser = { id: 1 } as UserEntity;
      const mockDocument = { id: 1 };

      jest.spyOn(service, 'getUserFromRequest').mockResolvedValue(mockUser);
      jest.spyOn(service, 'create').mockResolvedValue(mockDocument as any);

      const req = { user: { userId: 1 } } as any;

      const result = await controller.uploadDocument(mockFile, req);

      expect(service.getUserFromRequest).toHaveBeenCalledWith(1);
      expect(service.create).toHaveBeenCalledWith(mockFile, mockUser);
      expect(result).toEqual({
        message: 'Document uploaded successfully',
        document: { id: mockDocument.id },
      });
    });

    it('should throw an error if no file is uploaded', async () => {
      const req = { user: { userId: 1 } } as any;

      await expect(controller.uploadDocument(null as any, req)).rejects.toThrow(
        'Please upload valid file',
      );
    });
  });

  describe('getDocument', () => {
    it('should retrieve a document by ID', async () => {
      const mockStream = createReadStream('/dev/null'); // Mock ReadStream
      const mockUser = { id: 1 } as Partial<UserEntity>;

      jest
        .spyOn(service, 'getUserFromRequest')
        .mockResolvedValue(mockUser as UserEntity);
      jest.spyOn(service, 'retrieveDocument').mockResolvedValue(mockStream);

      const req = { user: { userId: 1 } } as any;

      const result = await controller.getDocument(1, req);

      expect(service.getUserFromRequest).toHaveBeenCalledWith(1);
      expect(service.retrieveDocument).toHaveBeenCalledWith(1, mockUser);
      expect(result).toBeInstanceOf(StreamableFile);
    });

    it('should throw an error if user is not authenticated', async () => {
      const req = { user: null } as any;

      await expect(controller.getDocument(1, req)).rejects.toThrow(
        'User not authenticated',
      );
    });
  });

  describe('updateDocument', () => {
    it('should update a document', async () => {
      const mockFile = {
        originalname: 'updated.pdf',
        filename: 'updated.pdf',
        mimetype: 'application/pdf',
      } as Express.Multer.File;

      const mockUser = { id: 1 } as UserEntity;

      jest.spyOn(service, 'getUserFromRequest').mockResolvedValue(mockUser);
      jest.spyOn(service, 'updateDocument').mockResolvedValue(undefined);

      const req = { user: { userId: 1 } } as any;

      const result = await controller.updateDocument(1, mockFile, req);

      expect(service.getUserFromRequest).toHaveBeenCalledWith(1);
      expect(service.updateDocument).toHaveBeenCalledWith(
        1,
        mockFile,
        mockUser,
      );
      expect(result).toEqual({
        message: 'Document updated successfully',
      });
    });
  });

  describe('listDocuments', () => {
    it('should return a list of documents', async () => {
      const mockUser = { id: 1 } as UserEntity;
      const mockDocuments = [
        { id: 1, name: 'test1.pdf', size: '1 MB', uploadedAt: new Date() },
        { id: 2, name: 'test2.pdf', size: '2 MB', uploadedAt: new Date() },
      ];

      jest.spyOn(service, 'getUserFromRequest').mockResolvedValue(mockUser);
      jest.spyOn(service, 'listDocuments').mockResolvedValue(mockDocuments);

      const req = { user: { userId: 1 } } as any;

      const result = await controller.listDocuments(req);

      expect(service.getUserFromRequest).toHaveBeenCalledWith(1);
      expect(service.listDocuments).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockDocuments);
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      const mockUser = { id: 1 } as UserEntity;

      jest.spyOn(service, 'getUserFromRequest').mockResolvedValue(mockUser);
      jest.spyOn(service, 'deleteDocument').mockResolvedValue(undefined);

      const req = { user: { userId: 1 } } as any;

      const result = await controller.deleteDocument(1, req);

      expect(service.getUserFromRequest).toHaveBeenCalledWith(1);
      expect(service.deleteDocument).toHaveBeenCalledWith(1, mockUser);
      expect(result).toEqual({
        message: 'Document deleted successfully',
      });
    });
  });
});
