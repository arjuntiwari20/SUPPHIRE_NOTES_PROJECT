import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNoteDto } from './dto/create.note.dto';

import { UpdateNoteDto } from './dto/update.note.dto';

import { Note } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class NotesService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // Create
  // notes.service.ts
  async createNote(
    dto: CreateNoteDto,
    userId: number,
    userName: string,
  ): Promise<any> {
    const note = await this.prisma.note.create({
      data: {
        title: dto.title,
        description: dto.description,
        createdById: userId,
        createdByName: userName,
        createdAt: new Date(),
        status: 'pending',
      },
      select: {
        Id: true,
        title: true,
        description: true,
        createdAt: true,
        createdById: true,
        createdByName: true,
        status: true,
      },
    });

    // ✅ After creating, fetch all notes of the user
    const allNotes = await this.prisma.note.findMany({
      where: { createdById: userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // ✅ Cache the updated list with proper key
    const cacheKey = `user:${userId}:note`;
    await this.cacheManager.set(cacheKey, allNotes);
    console.log(
      `✅ Cached all notes for userId ${userId} with key ${cacheKey}`,
    );

    return note;
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
    const cacheKey = `user:${userId}:note`;

    // Step 1: Try to get from Redis cache
    const cached = await this.cacheManager.get<Note[]>(cacheKey);
    if (cached) {
      console.log('✅ Cache Hit');
      return cached;
    }

    // Step 2: Cache Miss → Fetch from DB
    console.log('❌ Cache Miss');
    const note = await this.prisma.note.findMany({
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

    // Step 3: Store in Redis
    await this.cacheManager.set(cacheKey, note, 300);
    console.log(`✅ Stored in Redis with key: ${cacheKey}`);

    return note;
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

  // approvenote call
  async approveNote(NoteId: number, approvedById: number) {
    return this.prisma.note.update({
      where: { Id: NoteId },
      data: {
        status: 'approved',
        approvedById: approvedById,
      },
    });
  }




  async getMyApprovedNotes(userId: number) {
  return this.prisma.note.findMany({
    where: {
      createdById: userId,
    },
    select: {
      Id: true,
      title: true,
      status: true,
      approvedAt: true,
      approvedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
}
