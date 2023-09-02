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
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
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

@Controller('cards')
@ApiBearerAuth()
@ApiTags('cards')
@UseGuards(AuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Creating card.' })
  @ApiBody({ type: CreateCardDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Card created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Data is missing.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Title is already being used in another user card.',
  })
  createCard(@Body() body: CreateCardDto, @User() user: UserClass) {
    return this.cardsService.createCard(body, user);
  }

  @Get()
  @ApiOperation({ summary: 'Receive cards.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cards received successfully.',
  })
  getAllCards(@User() user: UserClass) {
    return this.cardsService.getAllCards(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Receive specific card.' })
  @ApiParam({
    name: 'id',
    description: 'card id',
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Card received successfully.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Card belongs to another user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Card doesn`t exist.',
  })
  getCard(@Param('id') id: string, @User() user: UserClass) {
    return this.cardsService.getCard(+id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove card.' })
  @ApiParam({
    name: 'id',
    description: 'card id',
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Card removed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Card belongs to another user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Card doesn`t exist.',
  })
  removeCard(@Param('id') id: string, @User() user: UserClass) {
    return this.cardsService.removeCard(+id, user);
  }
}
