import { Module } from '@nestjs/common';
import { EraseController } from './erase.controller';
import { EraseService } from './erase.service';
import { CardsModule } from '../cards/cards.module';
import { CredentialsModule } from '../credentials/credentials.module';
import { NotesModule } from '../notes/notes.module';

@Module({
  controllers: [EraseController],
  providers: [EraseService],
  imports: [CardsModule, CredentialsModule, NotesModule],
})
export class EraseModule {}
