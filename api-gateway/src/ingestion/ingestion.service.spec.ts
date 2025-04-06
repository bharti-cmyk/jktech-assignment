// import { Test, TestingModule } from '@nestjs/testing';
// import { IngestionService } from './ingestion.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { ClientProxy } from '@nestjs/microservices';
// import { UserEntity } from '../users/users.entity';
// import { DocumentEntity } from '../document/document.entity';
// import { Repository } from 'typeorm';
// import { of } from 'rxjs';
// import { ClsService } from 'nestjs-cls';

// describe('IngestionService', () => {
//   let service: IngestionService;
//   let ingestionClient: ClientProxy;
//   let userRepository: Repository<UserEntity>;
//   let documentRepository: Repository<DocumentEntity>;
//   let clsService: ClsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         IngestionService,
//         {
//           provide: 'INGESTION_SERVICE',
//           useValue: { send: jest.fn() },
//         },
//         {
//           provide: getRepositoryToken(UserEntity),
//           useValue: { findOneByOrFail: jest.fn() },
//         },
//         {
//           provide: getRepositoryToken(DocumentEntity),
//           useValue: { findOneByOrFail: jest.fn() },
//         },
//         {
//           provide: ClsService,
//           useValue: { someMethod: jest.fn() }, // Mock method of ClsService if needed
//         },
//       ],
//     }).compile();

//     service = module.get<IngestionService>(IngestionService);
//     ingestionClient = module.get<ClientProxy>('INGESTION_SERVICE');
//     userRepository = module.get<Repository<UserEntity>>(
//       getRepositoryToken(UserEntity),
//     );
//     documentRepository = module.get<Repository<DocumentEntity>>(
//       getRepositoryToken(DocumentEntity),
//     );
//     clsService = module.get<ClsService>(ClsService); // This is needed for testing if you call any ClsService method
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('addIngestion', () => {
//     it('should send add.ingestion event', async () => {
//       jest
//         .spyOn(ingestionClient, 'send')
//         .mockReturnValue(of({ ingestion: { id: 1 } }));
//       const result = await service.addIngestion({ someData: 'test' } as any, 1);
//       expect(result).toEqual({ ingestion: { id: 1 } });
//       expect(ingestionClient.send).toHaveBeenCalledWith(
//         'add.ingestion',
//         expect.any(Object),
//       );
//     });
//   });

//   describe('findIngestionById', () => {
//     it('should return ingestion details', async () => {
//       const ingestionResponse = {
//         ingestion: { id: 1, documentId: 2, userId: 3, status: 'pending' },
//       };
//       jest
//         .spyOn(ingestionClient, 'send')
//         .mockReturnValue(of(ingestionResponse));
//       jest
//         .spyOn(documentRepository, 'findOneByOrFail')
//         .mockResolvedValue({ id: 2, originalName: 'test.doc' } as any);
//       jest.spyOn(userRepository, 'findOneByOrFail').mockResolvedValue({
//         id: 3,
//         firstName: 'John',
//         email: 'john@example.com',
//       } as any);

//       const result = await service.findIngestionById(1);
//       expect(result).toEqual({
//         id: 1,
//         user: { id: 3, name: 'John', email: 'john@example.com' },
//         document: { id: 2, name: 'test.doc' },
//         status: 'pending',
//       });
//     });
//   });
// });
