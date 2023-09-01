import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() body: CreateUserDto) {
    return this.usersService.signUp(body);
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() body: CreateUserDto) {
    return this.usersService.signIn(body);
  }
}
