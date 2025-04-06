import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UserDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  email: string;
}

class DocumentDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}

export class IngestionResponseDto {
  @IsNumber()
  id: number;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @ValidateNested()
  @Type(() => DocumentDto)
  document: DocumentDto;

  @IsString()
  status: string;
}
