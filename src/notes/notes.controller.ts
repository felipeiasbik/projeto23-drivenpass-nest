import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as UserClass } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('notes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Creating notes.' })
  @ApiBody({ type: CreateNoteDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Note created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Data is missing.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Title is already being used in another user note.',
  })
  createNote(@Body() body: CreateNoteDto, @User() user: UserClass) {
    return this.notesService.createNote(body, user);
  }

  @Get()
  @ApiOperation({ summary: 'Receive notes.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notes received successfully.',
  })
  getNotes(@User() user: UserClass) {
    return this.notesService.getNotes(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Receive specific note.' })
  @ApiParam({
    name: 'id',
    description: 'note id',
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Note received successfully.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Note belongs to another user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Note doesn`t exist.',
  })
  getOneNote(@Param('id') id: string, @User() user: UserClass) {
    return this.notesService.getOneNote(+id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove note.' })
  @ApiParam({
    name: 'id',
    description: 'note id',
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Note removed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Note belongs to another user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Note doesn`t exist.',
  })
  removeNote(@Param('id') id: string, @User() user: UserClass) {
    return this.notesService.removeNote(+id, user);
  }
}
