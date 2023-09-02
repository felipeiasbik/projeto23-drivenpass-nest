import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { EraseService } from './erase.service';
import { User } from '../decorators/user.decorator';
import { User as UserClass } from '@prisma/client';
import { EraseUserDto } from './dto/erase.dto';

@Controller('erase')
@ApiBearerAuth()
@ApiTags('erase')
@UseGuards(AuthGuard)
export class EraseController {
  constructor(private readonly eraseService: EraseService) {}

  @Delete()
  @ApiOperation({ summary: 'Remove user and their data.' })
  @ApiBody({ type: EraseUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User and all their data have been successfully removed.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'If password is incorrect.',
  })
  deleteUser(@Body() body: EraseUserDto, @User() user: UserClass) {
    return this.eraseService.deleteUser(body, user);
  }
}
