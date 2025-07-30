import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create.note.dto';
import { UpdateNoteDto } from './dto/update.note.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Note } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/role.guard';
import { role } from 'src/common/decorators/role-user.decorator';
import { Query } from '@nestjs/common';

@UseGuards(JwtGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  // ✅ Create Note
  @Post('create')
  createNote(
    @Body() dto: CreateNoteDto,
    @GetUser('id') userId: number,
    @GetUser('name') userName: string,
  ): Promise<Note> {
    return this.notesService.createNote(dto, userId, userName);
  }

  // ✅ Update Note
  @Patch('update/:id')
  updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNoteDto,
    @GetUser('id') userId: number,
    @GetUser('name') userName: string,
  ): Promise<Note> {
    return this.notesService.updateNote(id, dto, userId, userName);
  }

  // ✅ Get All
  @Get('allnotes')
  getAllNotes(): Promise<any[]> {
    return this.notesService.getAllNotes();
  }

  @Get('GetNotesByuser')
  GetNotesByuser(@GetUser('id') userId: number): Promise<Note[]> {
    return this.notesService.GetnotesByuser(userId);
  }

  // ✅ Delete
  @Delete('delete/:id')
  @role('admin')
  deleteNote(
    @Param('id', ParseIntPipe) id: number,
    userName: string,
  ): Promise<Note> {
    return this.notesService.softDeleteNote(id, userName);
  }

  @Get('paginated')
  getNotesPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ): Promise<{
    data: Note[];
    currentPage: number;
    totalPages: number;
    totalRecords: number;
  }> {
    return this.notesService.getNotesPaginated(+page, +limit);
  }

  //approval api
  @Patch()
  async approveNote(
    @Param('NoteId', ParseIntPipe) NoteId: number,
    @GetUser('id') approvedById: number,
  ) {
    return this.notesService.approveNote(NoteId, approvedById);
  }

  @Patch('approve/:id')
  async approver(
    @Param('id', ParseIntPipe) noteId: number,
    @GetUser('id') approvedById: number,
    @GetUser('role') role: string, // 👈 get user role from JWT
  ) {
    if (role !== 'approver') {
      throw new ForbiddenException('Only approvers can approve notes');
    }

    return this.notesService.approveNote(noteId, approvedById);
  }

  // get my Approved notes

  @Get('getmyapproved')
  async getMyNotes(@GetUser('id') userId: number) {
    return this.notesService.getMyApprovedNotes(userId);
  }
}
