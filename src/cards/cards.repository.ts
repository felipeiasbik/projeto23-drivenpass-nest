import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  verifyCardTypeById(id: number) {
    return this.prisma.cardType.findUnique({
      where: { id },
    });
  }

  verifyCardByUserId(userId: number, title: string) {
    return this.prisma.card.findFirst({ where: { title, userId } });
  }

  createCard(body: CreateCardDto, userId: number) {
    return this.prisma.card.create({
      data: { ...body, userId },
      include: { cardType: { select: { type: true } } },
    });
  }

  getAllCards(userId: number) {
    return this.prisma.card.findMany({
      where: { userId },
      include: { cardType: { select: { type: true } } },
    });
  }

  getCard(id: number) {
    return this.prisma.card.findUnique({
      where: { id },
      include: { cardType: { select: { type: true } } },
    });
  }

  removeCard(id: number, userId: number) {
    return this.prisma.card.delete({ where: { id, userId } });
  }

  removeUserCards(userId: number) {
    return this.prisma.card.deleteMany({ where: { userId } });
  }
}
