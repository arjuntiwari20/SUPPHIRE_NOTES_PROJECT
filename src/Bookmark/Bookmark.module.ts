import { Module } from '@nestjs/common';
import { BookmarkController } from './Bookmark.controller';
import { BookmarkService } from './Bookmark.Service';
import { PrismaService } from '../../prisma/prisma.service';    // ✅ for DB access

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService, PrismaService],
})
export class BookmarkModule {}
