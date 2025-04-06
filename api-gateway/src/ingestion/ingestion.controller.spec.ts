// import { createMock, DeepMocked } from '@golevelup/ts-jest';
// import { Test, TestingModule } from '@nestjs/testing';
// import { IngestionController } from './ingestion.controller';
// import { IngestionService } from './ingestion.service';
// import { JwtAuthGuard } from '../auth/jwt.guard';
// import { RolesGuard } from '../users/roles.guard';
// import { Reflector } from '@nestjs/core';
// import { CreateIngestionDto } from './dto/create-ingestion.dto';

// describe('IngestionController', () => {
//   let controller: IngestionController;
//   let service: DeepMocked<IngestionService>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [IngestionController],
//       providers: [
//         Reflector,
//         {
//           provide: IngestionService,
//           useValue: createMock<IngestionService>(),
//         },
//       ],
//     })
//       .overrideGuard(JwtAuthGuard)
//       .useValue(createMock<JwtAuthGuard>())
//       .overrideGuard(RolesGuard)
//       .useValue(createMock<RolesGuard>())
//       .compile();

//     controller = module.get<IngestionController>(IngestionController);
//     service = module.get(IngestionService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   it('should call create and return ingestion data', async () => {
//     const createIngestionDto: CreateIngestionDto = {
//       documentId: 1,
//     };
//     const userId = 1;

//     jest.spyOn(service, 'addIngestion').mockResolvedValue({
//       id: 1,
//       ...createIngestionDto,
//     } as any);

//     const req = { user: { userId } } as any;
//     const result = await controller.create(createIngestionDto, req);

//     expect(service.addIngestion).toHaveBeenCalledWith(
//       createIngestionDto,
//       userId,
//     );
//     expect(result).toEqual({ id: 1, ...createIngestionDto });
//   });

//   it('should call findOne and return ingestion data', async () => {
//     const ingestionId = 1;
//     const ingestionData = { id: ingestionId, name: 'Test Ingestion' };

//     jest
//       .spyOn(service, 'findIngestionById')
//       .mockResolvedValue(ingestionData as any);

//     const result = await controller.findOne(ingestionId);

//     expect(service.findIngestionById).toHaveBeenCalledWith(ingestionId);
//     expect(result).toEqual(ingestionData);
//   });
// });
