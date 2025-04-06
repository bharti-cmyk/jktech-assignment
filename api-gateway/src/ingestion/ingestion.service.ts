import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { DocumentEntity } from '../document/document.entity';
import { UserEntity } from '../users/users.entity';
import { Repository } from 'typeorm';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { IngestionResponse } from './interface/ingestion-response.interface';
import { ClsService } from 'nestjs-cls';
import { IngestionResponseDto } from './dto/ingestion-response.dto';

@Injectable()
export class IngestionService {
  constructor(
    @Inject('INGESTION_SERVICE')
    private readonly ingestionClient: ClientProxy,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
  ) {}

  /**
   *  Add a new ingestion
   * @param createIngestionDto payload to create a new ingestion
   * @returns details of the created ingestion
   */
  async addIngestion(
    createIngestionDto: CreateIngestionDto,
    userId: number,
  ): Promise<IngestionResponseDto> {
    const response = await firstValueFrom(
      this.ingestionClient.send<
        IngestionResponseDto,
        CreateIngestionDto & { userId: number }
      >('add.ingestion', {
        userId,
        ...createIngestionDto,
      }),
    );

    return response;
  }

  /**
   * Get details of ingestion by id
   * @param id ingestion id
   * @returns the details of the ingestion
   */
  async findIngestionById(id: number): Promise<IngestionResponseDto> {
    let response: IngestionResponse;
    try {
      response = await firstValueFrom(
        this.ingestionClient.send<IngestionResponse, number>(
          'get.ingestion',
          id,
        ),
      );
    } catch (error) {
      console.error(`Error fetching ingestion with ID ${id}:`, error.message);
      throw new HttpException(
        `Failed to fetch ingestion with ID ${id}. Please try again later.`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    // Validate the response
    if (!response || !response.ingestion) {
      throw new HttpException(
        `Ingestion with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const [document, user] = await Promise.all([
      this.documentRepository.findOneByOrFail({
        id: response.ingestion.documentId,
      }),
      this.userRepository.findOneByOrFail({ id: response.ingestion.userId }),
    ]);

    if (!document) {
      throw new HttpException(
        `Document with ID ${response.ingestion.documentId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user) {
      throw new HttpException(
        `User with ID ${response.ingestion.userId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      id: response.ingestion.id,
      user: {
        id: user.id,
        name: user.firstName,
        email: user.email,
      },
      document: {
        id: document.id,
        name: document.originalName,
      },
      status: response.ingestion.status,
    };
  }
}
