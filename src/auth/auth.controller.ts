import {Controller, Post, Body, Res} from '@nestjs/common';
import { authService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import {Response } from 'express';


@Controller('auth')


export class authController {
   constructor(private readonly authService: authService) {}




    
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

 @Post('login')
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