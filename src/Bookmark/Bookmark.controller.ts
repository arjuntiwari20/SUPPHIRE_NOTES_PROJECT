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
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Bookmarks')
@ApiBearerAuth('access_token')
@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly BookmarkService: BookmarkService) {}

  @Post(':NoteId')
  @ApiOperation({
    summary: 'Bookmark a note',
    description:
      'Bookmarks a note for the logged-in user using the provided Note ID. Prevents duplicate bookmarks.',
  })
  @ApiResponse({ status: 201, description: 'Note bookmarked successfully.' })
  @ApiResponse({ status: 409, description: 'Note already bookmarked.' })
  async bookmark(
    @Param('NoteId', ParseIntPipe) NoteId: number,
    @GetUser('id') UserId: number,
  ) {
    return this.BookmarkService.create(UserId, NoteId);
  }
  @Get('mybookmarked')
  @ApiOperation({
    summary: 'Get all my bookmarked notes',
    description:
      'Returns a list of notes that the currently logged-in user has bookmarked.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of bookmarked notes retrieved successfully.',
  })
  async getOnlyNotes(@GetUser('id') userId: string) {
    console.log('Hello  world');
    const bookmarks = await this.BookmarkService.findOurbookmarked(+userId);
    return bookmarks;
  }
}
