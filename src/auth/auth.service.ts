import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express'; // ✅ Correct import
import { ConfigService } from '@nestjs/config';

@Injectable()
export class authService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwt: JwtService,
  ) {}
  getJwtSecret() {
    return this.configService.get<string>('JWT_SECRET');
  }
  async signup(dto: SignupDto) {
    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        password: hashed,
        role: dto.role,
        name: dto.name,
      },
    });
    const { password, ...result } = user;
    return result;
  }

  // login Function in authService
async login(dto: LoginDto) {
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email.toLowerCase() },
  });

  if (!user || !(await bcrypt.compare(dto.password, user.password))) {
    throw new ForbiddenException('Invalid credentials');
  }

  // ✅ Generate JWT token
  const payload = { id: user.id, email: user.email, name: user.name, role:user.role, };
  const access_token = await this.jwt.signAsync(payload, {
    secret: process.env.JWT_SECRET,
    expiresIn: '1d',
  });

  return {
    access_token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role:user.role,
    },
  };
}

}
