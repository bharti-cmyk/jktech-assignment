import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IngestionService } from './ingestion.service';
import { AddIngestionDTO } from './dto/add-ingestion.dto';

@Controller()
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @MessagePattern('add.ingestion')
  async addIngestion(data: AddIngestionDTO) {
    const ingestion = await this.ingestionService.addIngestion(data);

    return {
      message: 'Successfully added',
      ingestion,
    };
  }

  @MessagePattern('get.ingestion')
  async getIngestion(id: number) {
    const ingestion = await this.ingestionService.getIngestion(id);

    return {
      message: 'Successfully fetched',
      ingestion,
    };
  }
}
