import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { NotesRepository } from './notes.repository';
import { User } from '@prisma/client';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  async createNote(body: CreateNoteDto, user: User) {
    const note = await this.notesRepository.verifyNoteByUserId(
      user.id,
      body.title,
    );
    if (note) throw new ConflictException('This title already exists.');

    return await this.notesRepository.createNote(body, user.id);
  }

  async getNotes(user: User) {
    return await this.notesRepository.getNotes(user.id);
  }

  async getOneNote(id: number, user: User) {
    const note = await this.notesRepository.getOneNote(id);
    if (!note) throw new NotFoundException();
    if (note.userId !== user.id) throw new ForbiddenException();

    return note;
  }

  async removeNote(id: number, user: User) {
    await this.getOneNote(id, user);
    return await this.notesRepository.removeNote(id, user.id);
  }
}
