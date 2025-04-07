import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UserData {
  @IsNumber()
  id: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNumber()
  roleId: number;
}
