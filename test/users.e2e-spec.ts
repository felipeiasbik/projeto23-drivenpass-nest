import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { E2EUtils } from './utils/e2e-utils';
import { UsersFactories } from './factories/users.factory';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';

describe('User (e2e) Tests', () => {
  let app: INestApplication;
  const prisma: PrismaService = new PrismaService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    await E2EUtils.cleanDb(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /users => should create a user', async () => {
    const userDto: CreateUserDto = new CreateUserDto();
    userDto.email = faker.internet.email();
    userDto.password = 'S@nh@F1rt@';

    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(userDto)
      .expect(HttpStatus.CREATED);

    const users = await prisma.user.findMany();
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user).toEqual<User>({
      id: expect.any(Number),
      email: expect.any(String),
      password: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('POST /users => should login a user', async () => {
    await new UsersFactories(prisma)
      .withEmail('testando@testando.com')
      .withPassword('S1nh@F@rt@')
      .persist();

    const userDto: CreateUserDto = new CreateUserDto({
      email: 'testando@testando.com',
      password: 'S1nh@F@rt@',
    });

    await request(app.getHttpServer())
      .post('/users/sign-in')
      .send(userDto)
      .expect(HttpStatus.CONFLICT);
  });
});
