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
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
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

@Controller('/credentials')
@ApiTags('credentials')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @ApiOperation({ summary: 'Register a credential.' })
  @ApiBody({ type: CreateCredentialDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Registration success.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Data is missing.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Title is already being used in another user credential.',
  })
  createCredential(@Body() body: CreateCredentialDto, @User() user: UserClass) {
    return this.credentialsService.createCredential(body, user);
  }

  @Get()
  @ApiOperation({ summary: 'Receive all credentials.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credentials received successfully.',
  })
  getCredentials(@User() user: UserClass) {
    return this.credentialsService.getCredentials(user);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Receive specific credential.' })
  @ApiParam({
    name: 'id',
    description: 'credential id',
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential received successfully.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Credential belongs to another user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credential doesn`t exist.',
  })
  getOneCredential(@Param('id') id: string, @User() user: UserClass) {
    return this.credentialsService.getOneCredential(user, +id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove credential.' })
  @ApiParam({
    name: 'id',
    description: 'credential id',
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential removed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Credential belongs to another user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credential doesn`t exist.',
  })
  removeCredential(@Param('id') id: string, @User() user: UserClass) {
    return this.credentialsService.removeCredential(+id, user);
  }
}
