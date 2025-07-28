import { IsEmail, IsString, IsIn } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  name: string; 

  @IsIn(['admin', 'employee'])
  role: 'admin' | 'employee';
}
