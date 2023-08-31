import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as UserClass } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  createCard(@Body() body: CreateCardDto, @User() user: UserClass) {
    return this.cardsService.createCard(body, user);
  }

  @Get()
  getAllCards(@User() user: UserClass) {
    return this.cardsService.getAllCards(user);
  }

  @Get(':id')
  getCard(@Param('id') id: string, @User() user: UserClass) {
    return this.cardsService.getCard(+id, user);
  }

  @Delete(':id')
  removeCard(@Param('id') id: string, @User() user: UserClass) {
    return this.cardsService.removeCard(+id, user);
  }
}
