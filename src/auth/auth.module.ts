import { Module } from '@nestjs/common';
import { authService } from './auth.service';
import { authController } from './auth.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PrismaModule,PassportModule, JwtModule.register({ secret: 'JWT_SECRET' })],
  providers: [authService,JwtStrategy],
  controllers: [authController],
  exports: [PassportModule],
})
export class AuthModule {}
