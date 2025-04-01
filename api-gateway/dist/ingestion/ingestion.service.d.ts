import { ClientProxy } from '@nestjs/microservices';
import { DocumentEntity } from '../../src/document/document.entity';
import { UserEntity } from '../../src/users/users.entity';
import { Repository } from 'typeorm';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { IngestionResponse } from './interface/ingestion-response.interface';
import { ClsService } from 'nestjs-cls';
export declare class IngestionService {
    private readonly ingestionClient;
    private readonly userRepository;
    private readonly documentRepository;
    private readonly clsService;
    constructor(ingestionClient: ClientProxy, userRepository: Repository<UserEntity>, documentRepository: Repository<DocumentEntity>, clsService: ClsService);
    addIngestion(createIngestionDto: CreateIngestionDto, userId: number): Promise<IngestionResponse>;
    findIngestionById(id: number): Promise<{
        id: number;
        user: {
            id: number;
            name: string;
            email: string;
        };
        document: {
            id: number;
            name: string;
        };
        status: string;
    }>;
}
