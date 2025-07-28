import { Module } from '@nestjs/common';

import { NotesModule } from './notes/notes.module';
import {NotesController} from './notes/notes.controller';
import { NotesService } from './notes/notes.service';
import { PrismaService } from '../prisma/prisma.service'
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';






@Module({
  

 
  imports: [ NotesModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule],
  providers:[PrismaService]

})


export class AppModule {} 
