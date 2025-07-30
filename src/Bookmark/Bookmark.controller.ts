import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BookmarkService } from './Bookmark.Service';
import { ParseIntPipe } from '@nestjs/common';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly BookmarkService: BookmarkService) {}

  @Post(':NoteId')
  async bookmark(
    @Param('NoteId', ParseIntPipe) NoteId: number,
    @GetUser('id') UserId: number,
  ) {
    return this.BookmarkService.create(UserId, NoteId);
  }
  @Get('mybookmarked')
  async getOnlyNotes(@GetUser('id') userId: string) {
    console.log("Hello  world")
    const bookmarks = await this.BookmarkService.findOurbookmarked(+userId);
    return bookmarks;
  }
}
