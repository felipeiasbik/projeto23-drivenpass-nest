import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import { UsersService } from '../users/users.service';
import Cryptr from 'cryptr';
import { User } from '@prisma/client';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly usersService: UsersService,
  ) {}

  async createCredential(body: CreateCredentialDto, user: User) {
    const titleExists = await this.credentialsRepository.verifyTitleByUserId(
      user.id,
      body.title,
    );
    if (titleExists) throw new ConflictException('This title already exists.');
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const credentialsPass = cryptr.encrypt(body.credentialsPass);
    const newBody = { ...body, credentialsPass };
    return await this.credentialsRepository.createCredential(newBody, user.id);
  }

  async getCredentials(user: User) {
    const credentials = await this.credentialsRepository.getCredentials(
      user.id,
    );
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const returnCredential = credentials.map(
      ({ credentialsPass, createdAt, updatedAt, ...rest }) => ({
        ...rest,
        credentialsPass: cryptr.decrypt(credentialsPass),
        createdAt,
        updatedAt,
      }),
    );
    return returnCredential;
  }

  async getOneCredential(user: User, id: number) {
    const credential = await this.credentialsRepository.getOneCredential(id);
    if (!credential) throw new NotFoundException();
    if (credential.userId !== user.id) throw new ForbiddenException();

    const { credentialsPass, createdAt, updatedAt, ...rest } = credential;
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

    return {
      ...rest,
      credentialsPass: cryptr.decrypt(credentialsPass),
      createdAt,
      updatedAt,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} credential`;
  }
}
