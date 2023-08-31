import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as UserClass } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('/credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  createCredential(@Body() body: CreateCredentialDto, @User() user: UserClass) {
    return this.credentialsService.createCredential(body, user);
  }

  @Get()
  getCredentials(@User() user) {
    return this.credentialsService.getCredentials(user);
  }

  @Get('/:id')
  getOneCredential(@Param('id') id: string, @User() user) {
    return this.credentialsService.getOneCredential(user, +id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.credentialsService.remove(+id);
  }
}
