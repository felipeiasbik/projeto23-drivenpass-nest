import { Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CredentialsRepository {
  constructor(private readonly prisma: PrismaService) {}

  verifyTitleByUserId(userId: number, title: string) {
    return this.prisma.credential.findFirst({ where: { title, userId } });
  }

  createCredential(body: CreateCredentialDto, userId: number) {
    return this.prisma.credential.create({ data: { ...body, userId } });
  }

  getCredentials(userId: number) {
    return this.prisma.credential.findMany({ where: { userId } });
  }

  getOneCredential(id: number) {
    return this.prisma.credential.findUnique({ where: { id } });
  }

  removeCredential(id: number, userId: number) {
    return this.prisma.credential.delete({ where: { id, userId } });
  }
}
