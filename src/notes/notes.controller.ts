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
  NotFoundException,
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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Notes')
@ApiBearerAuth('access_token')
@UseGuards(JwtGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  // ✅ Create Note
  @Post('create')
  @ApiOperation({
    summary: 'Create a new note',
    description:
      'Creates a note with title and description. Initially marked as pending for approval.',
  })
  @ApiResponse({ status: 201, description: 'Note created successfully.' })
  createNote(
    @Body() dto: CreateNoteDto,
    @GetUser('id') userId: number,
    @GetUser('name') userName: string,
  ): Promise<Note> {
    return this.notesService.createNote(dto, userId, userName);
  }

  // ✅ Update Note
  @Patch('update/:id')
  @ApiOperation({
    summary: 'Update note',
    description:
      'Updates the content of an existing note and logs the update information.',
  })
  @ApiResponse({ status: 200, description: 'Note updated successfully.' })
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
  @ApiOperation({
    summary: 'Get all notes',
    description:
      'Returns all notes in the system. Typically used by admin or for testing.',
  })
  getAllNotes(): Promise<any[]> {
    return this.notesService.getAllNotes();
  }

  @Get('GetNotesByuser')
  @ApiOperation({
    summary: 'Get my notes',
    description: 'Returns all notes created by the currently logged-in user.',
  })
  GetNotesByuser(@GetUser('id') userId: number): Promise<Note[]> {
    return this.notesService.GetnotesByuser(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get note by ID',
    description:
      'Returns a specific note using its ID. Shows who created and approved it.',
  })
  async getNoteById(@Param('id', ParseIntPipe) id: number) {
    const note = await this.notesService.getNoteById(id);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  // ✅ Delete
  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Delete a note (soft)',
    description:
      'Marks the note as deleted and records who deleted it. Admin only.',
  })
  @role('admin')
  deleteNote(
    @Param('id', ParseIntPipe) id: number,
    userName: string,
  ): Promise<Note> {
    return this.notesService.softDeleteNote(id, userName);
  }

  @Get('paginated')
  @ApiOperation({
    summary: 'Get paginated notes',
    description:
      'Returns paginated list of notes based on page number and limit.',
  })
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
  @ApiOperation({
    summary: 'Approve a note',
    description:
      'Approver user approves a note. Approval is counted and once it reaches the limit, note becomes approved.',
  })
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

  @Patch('set-approvals/:id')
  @ApiOperation({
    summary: 'Set approval limit',
    description:
      'Admin sets how many approvers are required to approve a note. Cannot be set by the creator admin.',
  })
  async setApprovalLimit(
    @Param('id', ParseIntPipe) NoteId: number,
    @Body('requiredApprovals') requiredApprovals: number,
    @GetUser() User: any,
  ) {
    const note = await this.notesService.getNoteById(NoteId);

    if (User.role !== 'admin') {
      throw new ForbiddenException('only admin can set approval limit ');
    }

    if (note.createdById === User.id) {
      throw new ForbiddenException('Admin cannot set approval for own post ');
    }

    return this.notesService.setApprovalLimit(NoteId, requiredApprovals);
  }

  @Get('getmyapproved')
  @ApiOperation({
    summary: 'Get approved notes',
    description:
      'Returns notes created by current user that have been fully approved.',
  })
  async getMyApprovedNotess(@GetUser('id') userId: number) {
    return this.notesService.getMyApprovedNotes(userId);
  }
}
