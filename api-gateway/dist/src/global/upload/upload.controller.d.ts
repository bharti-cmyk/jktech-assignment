export declare class UploadController {
    uploadFile(file: Express.Multer.File): {
        message: string;
        file: {
            originalname: string;
            filename: string;
            mimetype: string;
            size: number;
        };
    };
}
