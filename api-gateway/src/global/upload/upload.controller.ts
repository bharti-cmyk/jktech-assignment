import { Controller, Post, UploadedFile } from '@nestjs/common';
import { Express } from 'express';

@Controller('upload')
export class UploadController {
  @Post()
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'File uploaded successfully',
      file: {
        originalname: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
      },
    };
  }
}
