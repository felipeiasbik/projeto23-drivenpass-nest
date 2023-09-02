import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { CardsRepository } from './cards.repository';
import { User } from '@prisma/client';
import Cryptr from 'cryptr';
import { CreateCardTypeDto } from './dto/create-card-types';

@Injectable()
export class CardsService {
  constructor(private readonly cardsRepository: CardsRepository) {}

  async createCard(body: CreateCardDto, user: User) {
    const card = await this.cardsRepository.verifyCardByUserId(
      user.id,
      body.title,
    );
    if (card) throw new ConflictException('This title already exists.');

    const cardType = await this.cardsRepository.verifyCardTypeById(
      body.cardTypeId,
    );
    if (!cardType) throw new NotAcceptableException('Type Card not acceptable');

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const cardCvv = cryptr.encrypt(body.cardCvv);
    const cardPass = cryptr.encrypt(body.cardPass);

    delete body.cardCvv;
    delete body.cardPass;
    const newBody = { ...body, cardCvv, cardPass };

    return await this.cardsRepository.createCard(newBody, user.id);
  }

  async getAllCards(user: User) {
    const cards = await this.cardsRepository.getAllCards(user.id);
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const returnCard = cards.map(
      ({ cardCvv, cardPass, createdAt, updatedAt, ...rest }) => ({
        ...rest,
        cardCvv: cryptr.decrypt(cardCvv),
        cardPass: cryptr.decrypt(cardPass),
        createdAt,
        updatedAt,
      }),
    );
    return returnCard;
  }

  async getCard(id: number, user: User) {
    const card = await this.cardsRepository.getCard(id);
    if (!card) throw new NotFoundException();
    if (card.userId !== user.id) throw new ForbiddenException();

    const { cardCvv, cardPass, createdAt, updatedAt, ...rest } = card;
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

    return {
      ...rest,
      cardCvv: cryptr.decrypt(cardCvv),
      cardPass: cryptr.decrypt(cardPass),
      createdAt,
      updatedAt,
    };
  }

  async removeCard(id: number, user: User) {
    await this.getCard(id, user);
    return await this.cardsRepository.removeCard(id, user.id);
  }

  async removeUserCards(userId: number) {
    return await this.cardsRepository.removeUserCards(userId);
  }

  async createCardTypes(body: CreateCardTypeDto) {
    return await this.cardsRepository.createCardTypes(body);
  }
}
