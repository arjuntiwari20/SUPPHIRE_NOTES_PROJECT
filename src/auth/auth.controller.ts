import { Controller, Post, Body, Res } from '@nestjs/common';
import { authService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class authController {
  constructor(private readonly authService: authService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account and returns success response.',
  })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description:
      'Authenticates a user with email and password, and returns a JWT token and user info.',
  })
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const token = await this.authService.login(dto);

    console.log(token); // just for debugging

    return res.json({
      access_token: token.access_token,
      message: 'Login success',
      user: token.user,
    });
  }
}
