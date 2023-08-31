import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  verifyNoteByUserId(userId: number, title: string) {
    return this.prisma.note.findFirst({ where: { title, userId } });
  }

  createNote(body: CreateNoteDto, userId: number) {
    return this.prisma.note.create({ data: { ...body, userId } });
  }

  getNotes(userId: number) {
    return this.prisma.note.findMany({ where: { userId } });
  }

  getOneNote(id: number) {
    return this.prisma.note.findUnique({ where: { id } });
  }

  removeNote(id: number, userId: number) {
    return this.prisma.note.delete({ where: { id, userId } });
  }
}
