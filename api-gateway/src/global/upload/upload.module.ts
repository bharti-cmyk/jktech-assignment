import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';

@Module({
  controllers: [UploadController], // ✅ Register UploadController
})
export class UploadModule {}
