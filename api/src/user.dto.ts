import { IsEmail, IsNotEmpty, IsPositive, IsUrl } from 'class-validator';

export class UserDto {
  @IsPositive()
  id: number;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsUrl()
  avatar: string;
}
