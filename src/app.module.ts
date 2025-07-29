import { Module } from '@nestjs/common';

import { NotesModule } from './notes/notes.module';
import {NotesController} from './notes/notes.controller';
import { NotesService } from './notes/notes.service';
import { PrismaService } from '../prisma/prisma.service'
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';







@Module({
  

 
  imports: [ NotesModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule, CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          host: '127.0.0.1',  // or 127.0.0.1
          port: 6379,         // default Redis port
          ttl: 0,             // default TTL in seconds (0 = no expiry)
        }),
      }),
    })],
  providers:[PrismaService]

})


export class AppModule {} 
