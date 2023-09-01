import {
  ExecutionContext,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const response = context.switchToHttp().getResponse();
    if (!response.locals.user) {
      throw new NotFoundException('User not found.');
    }

    return response.locals.user;
  },
);
