import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../users/roles.guard';
import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { Express } from 'express';

describe('DocumentController', () => {
  let controller: DocumentController;
  let documentService: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: {
            create: jest.fn(),
            retrieveDocument: jest.fn(),
            updateDocument: jest.fn(),
            listDocuments: jest.fn(),
            deleteDocument: jest.fn(),
            getUserFromRequest: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(createMock<JwtAuthGuard>())
      .overrideGuard(RolesGuard)
      .useValue(createMock<RolesGuard>())
      .compile();

    controller = module.get<DocumentController>(DocumentController);
    documentService = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadDocument', () => {
    it('should upload a document', async () => {
      const mockFile = { filename: 'test.pdf' } as Express.Multer.File;
      const mockUser = { id: 1 };
      documentService.getUserFromRequest = jest
        .fn()
        .mockResolvedValue(mockUser);
      documentService.create = jest.fn().mockResolvedValue({ id: 1 });

      const result = await controller.uploadDocument(mockFile, {
        user: mockUser,
      } as any);
      expect(result).toEqual({
        message: 'Document uploaded successfully',
        document: { id: 1 },
      });
    });
  });

  describe('getDocument', () => {
    it('should retrieve a document', async () => {
      const mockUser = { id: 1 };
      const mockStream = Buffer.from('mock data');
      documentService.getUserFromRequest = jest
        .fn()
        .mockResolvedValue(mockUser);
      documentService.retrieveDocument = jest
        .fn()
        .mockResolvedValue(mockStream);

      const result = await controller.getDocument(1, { user: mockUser } as any);
      expect(result).toBeDefined();
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      const mockUser = { id: 1 };
      documentService.getUserFromRequest = jest
        .fn()
        .mockResolvedValue(mockUser);
      documentService.deleteDocument = jest.fn().mockResolvedValue(true);

      const result = await controller.deleteDocument(1, {
        user: mockUser,
      } as any);
      expect(result).toEqual({ message: 'Document deleted successfully' });
    });
  });
});
