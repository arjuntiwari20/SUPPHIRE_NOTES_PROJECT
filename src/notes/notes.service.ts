import { Injectable } from '@nestjs/common';

@Injectable()
export class NotesService {
  private notes: { title: string; description: string }[] = [];

  Create(note: { title: string; description: string }) {
    this.notes.push(note);
    return note;
  }

  findAll() {
    return this.notes;

  }
}
