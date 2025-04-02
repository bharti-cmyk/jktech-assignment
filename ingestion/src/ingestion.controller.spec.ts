import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: DeepMocked<IngestionService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: createMock<IngestionService>(),
        },
      ],
    }).compile();

    controller = module.get(IngestionController);
    service = module.get(IngestionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add ingestion', async () => {
    const data = { documentId: 1, userId: 1 };
    const ingestion = { id: 1, ...data };

    jest.spyOn(service, 'addIngestion').mockResolvedValue(ingestion as any);

    expect(await controller.addIngestion(data)).toStrictEqual({
      message: 'Successfully added',
      ingestion,
    });
  });

  it('should get ingestion', async () => {
    const id = 1;
    const ingestion = { id };

    jest.spyOn(service, 'getIngestion').mockResolvedValue(ingestion as any);

    expect(await controller.getIngestion(id)).toStrictEqual({
      message: 'Successfully fetched',
      ingestion,
    });
  });
});
