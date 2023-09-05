import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';

export class UsersFactories {
  async createUser(prisma: PrismaService) {
    const userDto: CreateUserDto = new CreateUserDto();
    userDto.email = faker.internet.email();
    userDto.password = 'S@nh@F1rt@';

    const result = await prisma.user.create({
      data: {
        email: userDto.email,
        password: userDto.password,
      },
    });
    return result;
  }
}
