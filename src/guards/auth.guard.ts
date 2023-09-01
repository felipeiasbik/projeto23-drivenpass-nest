import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Request, Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { authorization } = request.headers;

    try {
      const data = this.usersService.checkToken(
        (authorization ?? '').split(' ')[1],
      );
      const user = await this.usersService.getUserById(parseInt(data.sub));
      response.locals.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
