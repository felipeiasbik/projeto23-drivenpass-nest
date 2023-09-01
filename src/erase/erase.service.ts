import { Injectable } from '@nestjs/common';
import { EraseUserDto } from './dto/erase.dto';
import { User } from '@prisma/client';
import { CardsService } from '../cards/cards.service';
import { CredentialsService } from '../credentials/credentials.service';
import { NotesService } from '../notes/notes.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class EraseService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cardsService: CardsService,
    private readonly credentialsService: CredentialsService,
    private readonly notesService: NotesService,
  ) {}

  async deleteUser(body: EraseUserDto, user: User) {
    const newBody = { email: user.email, password: body.password };
    await this.usersService.signIn(newBody);
    await this.cardsService.removeUserCards(user.id);
    await this.credentialsService.removeUserCredentials(user.id);
    await this.notesService.removeUserNotes(user.id);
    await this.usersService.deleteUser(user.id);
    return `Usuário ${user.email} e todas as suas informações foram excluídas.`;
  }
}
