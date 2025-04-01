import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { IngestionService } from './ingestion.service';
interface AuthTokenPayload {
    userId: number;
    email: string;
    iat: number;
}
interface AuthenticatedRequest extends Request {
    user: AuthTokenPayload;
}
export declare class IngestionController {
    private readonly ingestionService;
    constructor(ingestionService: IngestionService);
    create(createIngestionDto: CreateIngestionDto, req: AuthenticatedRequest): Promise<import("./interface/ingestion-response.interface").IngestionResponse>;
    findOne(id: number): Promise<{
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
export {};
