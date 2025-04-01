import { StreamableFile } from '@nestjs/common';
import { DocumentService } from './document.service';
interface AuthTokenPayload {
    userId: number;
    email: string;
    iat: number;
}
interface AuthenticatedRequest extends Request {
    user: AuthTokenPayload;
}
export declare class DocumentController {
    private readonly documentService;
    constructor(documentService: DocumentService);
    uploadDocument(file: Express.Multer.File, req: AuthenticatedRequest): Promise<{
        message: string;
        document: {
            id: number;
        };
    }>;
    getDocument(id: number, req: any): Promise<StreamableFile>;
    updateDocument(id: number, file: Express.Multer.File, req: any): Promise<{
        message: string;
    }>;
    listDocuments(req: any): Promise<{
        id: number;
        name: string;
        size: string;
        uploadedAt: Date;
    }[]>;
    deleteDocument(id: number, req: any): Promise<{
        message: string;
    }>;
}
export {};
