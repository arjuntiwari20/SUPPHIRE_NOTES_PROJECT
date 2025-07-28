import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNoteDto } from './dto/create.note.dto';

import { UpdateNoteDto } from './dto/update.note.dto';

import { Note } from '@prisma/client';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  // Create
  // notes.service.ts
  async createNote(
    dto: CreateNoteDto,
    userId: number,
    userName: string,
  ): Promise<any> {
    return this.prisma.note.create({
      data: {
        title: dto.title,
        description: dto.description,
        createdById: userId,
        createdByName: userName,
        createdAt: new Date(),
      },

      select: {
        Id: true,
        title: true,
        description: true,
        createdAt: true,
        createdById: true,
        createdByName: true,
        // ❌ exclude updatedAt, updatedBy, deletedAt, deletedBy
      },
    });
    // or we can also use fillterd for specific data
    // if we want to show  the specific value
  }
  // Get All
  getAllNotes(): Promise<Note[]> {
    return this.prisma.note.findMany({
      include: {
        user: {
          select: {
            name: true, // 🧠 Sirf name field la rahe hain
          },
        },
      },
    });
  }

  async GetnotesByuser(userId: number): Promise<Note[]> {
    return this.prisma.note.findMany({
      where: {
        createdById: userId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }


  // Update
  async updateNote(
    Id: number,
    dto: UpdateNoteDto,
    userId: number,
    userName: string,
  ): Promise<any> {
    const existing = await this.prisma.note.findUnique({ where: { Id } });
    if (!existing) throw new NotFoundException('Note not found');

    return this.prisma.note.update({
      where: { Id },
      data: {
        title: dto.title,
        description: dto.description,
        newTitle: dto.title,
        newDescription: dto.description,
        oldTitle: existing.title,
        oldDescription: existing.description,

        // updatedById: userId,
        updatedBy: userName,
        updatedAt: new Date(),
      },
      select: {
        title: true,
        description: true,
        newTitle: true,
        newDescription: true,
        oldTitle: true,
        oldDescription: true,

        // updatedById: userId,
        updatedBy: true,
        updatedAt: true,
      },
    });
  }

  // Delete Note
  /*
  async deleteNote(Id: number): Promise<Note> {
    return this.prisma.note.delete({ where: { Id } });
  }
    */

  async softDeleteNote(Id: number, userName: string): Promise<Note> {
    return this.prisma.note.update({
      where: { Id },
      data: {
        deletedAt: new Date(),
        deletedBy: userName,
        title: 'Deleted',
        description: 'This note was deleted by the user.',
      },
    });
  }



  // Pagination function call 
  async getNotesPaginated(page: number = 1, limit: number = 5) {
  const skip = (page - 1) * limit;

  const [note, total] = await this.prisma.$transaction([
    this.prisma.note.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.note.count(),
  ]);

  return {
    data: note,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalRecords: total,
  };
}

}
