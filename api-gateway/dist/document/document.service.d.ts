import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { DocumentEntity } from './document.entity';
import { AbilityFactory } from '../casl/ability.factory';
import { UserEntity } from '../users/users.entity';
import { AuthService } from '../auth/auth.service';
export declare class DocumentService {
    private documentRepository;
    private readonly configService;
    private readonly abilityFactory;
    private readonly authService;
    constructor(documentRepository: Repository<DocumentEntity>, configService: ConfigService, abilityFactory: AbilityFactory, authService: AuthService);
    create(file: Express.Multer.File, user: UserEntity): Promise<DocumentEntity>;
    getUserFromRequest(userId: number): Promise<UserEntity>;
    getDocumentById(id: number, user: UserEntity): Promise<DocumentEntity>;
    retrieveDocument(id: number, user: UserEntity): Promise<import("fs").ReadStream>;
    updateDocument(id: number, document: Express.Multer.File, user: UserEntity): Promise<void>;
    deleteDocument(id: number, user: UserEntity): Promise<void>;
    getSizeOfDocument(path: string): Promise<string>;
    listDocuments(user: UserEntity): Promise<{
        id: number;
        name: string;
        size: string;
        uploadedAt: Date;
    }[]>;
}
