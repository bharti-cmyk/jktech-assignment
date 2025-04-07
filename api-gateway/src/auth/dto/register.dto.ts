import { IsString, IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsString()
  message: string;

  @ValidateNested()
  @Type(() => RegisterData)
  data: RegisterData;
}

export class RegisterData {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;
}
