import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/sign-up')
  @ApiOperation({ summary: 'Register a user.' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Registration success.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'E-mail and/or password data is missing.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already existing in the database.',
  })
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() body: CreateUserDto) {
    return this.usersService.signUp(body);
  }

  @Post('/sign-in')
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Authentication success.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access data does not match.',
  })
  @HttpCode(HttpStatus.OK)
  signIn(@Body() body: CreateUserDto) {
    return this.usersService.signIn(body);
  }
}
