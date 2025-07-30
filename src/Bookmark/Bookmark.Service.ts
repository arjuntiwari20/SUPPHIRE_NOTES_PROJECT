import {  Controller, Get, Post, Delete, Put, Param, Req, UseGuards,  } from '@nestjs/common';

import {Injectable} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {BookmarkController } from './Bookmark.controller';
import { NotesService } from '../notes/notes.service';




@Injectable()
export class BookmarkService {
    constructor(private prisma:PrismaService ) {}
    async create(UserId: number, NoteId: number) {
    return this.prisma.bookmark.create({
      data: {
        UserId,
        NoteId,
      },
      include:{
        Note:true,
      },
    });
  }

  
async findOurbookmarked(UserId: number) {
  return this.prisma.bookmark.findMany({
    where: { UserId },
    include: {
      Note: true,
    },
  });
}





/*
  async delete(userId: number, noteId: number) {
    return this.prisma.bookmark.delete({
      where: {
        userId_noteId: { userId, noteId },
      },
    });
  }
    */

}
