import {Controller, Get, Post, Body}  from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')


export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    @Post('createnotes') 
    createNote(@Body() note: {title: string; description: string }) {
        return this.notesService.Create(note);
    }



    @Get('allnotes')

    GetAllNotes() 
    {
        return this.notesService.findAll();

    }

}