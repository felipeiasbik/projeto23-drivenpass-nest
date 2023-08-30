import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  signUp(@Body() body: CreateUserDto) {
    return this.usersService.signUp(body);
  }

  @Post('/signin')
  signIn(@Body() body: CreateUserDto) {
    return this.usersService.signIn(body);
  }
}
