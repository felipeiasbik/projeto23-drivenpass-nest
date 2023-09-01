import { Body, Controller, Delete, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { EraseService } from './erase.service';
import { User } from '../decorators/user.decorator';
import { User as UserClass } from '@prisma/client';
import { EraseUserDto } from './dto/erase.dto';

@ApiTags('erase')
@UseGuards(AuthGuard)
@Controller('erase')
export class EraseController {
  constructor(private readonly eraseService: EraseService) {}

  @Delete()
  deleteUser(@Body() body: EraseUserDto, @User() user: UserClass) {
    return this.eraseService.deleteUser(body, user);
  }
}
