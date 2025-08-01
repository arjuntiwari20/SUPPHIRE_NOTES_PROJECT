import { IsEmail, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @IsEmail()
  @ApiProperty({
    example: 'user@example.com',
    description: 'Unique email address',
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: 'password123',
    description: 'Secure password',
  })
  password: string;

  @ApiProperty({
    example: 'Arjun',
    description: 'Full name of the user',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'admin',
    enum: ['admin', 'employee', 'approver'],
    description: 'Role assigned to the user',
  })
  @IsIn(['admin', 'employee', 'approver'])
  role: 'admin' | 'employee' | 'approver';
}
