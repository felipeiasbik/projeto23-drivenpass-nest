import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as UserClass } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  createNote(@Body() body: CreateNoteDto, @User() user: UserClass) {
    return this.notesService.createNote(body, user);
  }

  @Get()
  getNotes(@User() user: UserClass) {
    return this.notesService.getNotes(user);
  }

  @Get(':id')
  getOneNote(@Param('id') id: string, @User() user: UserClass) {
    return this.notesService.getOneNote(+id, user);
  }

  @Delete(':id')
  removeNote(@Param('id') id: string, @User() user: UserClass) {
    return this.notesService.removeNote(+id, user);
  }
}
