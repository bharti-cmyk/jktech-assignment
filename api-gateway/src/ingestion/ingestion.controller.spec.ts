import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard'; // Import your JwtAuthGuard
import { CreateIngestionDto } from './dto/create-ingestion.dto';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: {
            findIngestionById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);

    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error logs
  });

  describe('findOne', () => {
    it('should throw NotFoundException if ingestion record is not found', async () => {
      const ingestionId = 1;

      jest
        .spyOn(service, 'findIngestionById')
        .mockRejectedValue(new NotFoundException('Ingestion record not found'));

      await expect(controller.findOne(ingestionId)).rejects.toThrow(
        NotFoundException,
      );

      await expect(controller.findOne(ingestionId)).rejects.toThrow(
        'Ingestion record not found',
      );
    });

    it('should throw ForbiddenException if user lacks permissions', async () => {
      const ingestionId = 1;

      jest
        .spyOn(service, 'findIngestionById')
        .mockRejectedValue(new ForbiddenException('Forbidden'));

      await expect(controller.findOne(ingestionId)).rejects.toThrow(
        ForbiddenException,
      );

      await expect(controller.findOne(ingestionId)).rejects.toThrow(
        'Forbidden',
      );
    });
  });
});
