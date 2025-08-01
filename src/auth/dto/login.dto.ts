import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @IsString()
   @ApiProperty({
    example: 'password123',
    description: 'Password for the user account',
  })
  password: string;
}
