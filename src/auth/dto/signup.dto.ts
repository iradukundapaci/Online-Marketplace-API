import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class signupDto {
  @IsString()
  @IsNotEmpty()
  names: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  role;
}
