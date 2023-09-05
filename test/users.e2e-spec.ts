import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { E2EUtils } from './utils/e2e-utils';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { faker } from '@faker-js/faker';

describe('User (e2e) Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let server: request.SuperTest<request.Test>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService);

    await E2EUtils.cleanDb(prisma);

    await app.init();
    server = request(app.getHttpServer());
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /users/sign-up', () => {
    it('should respond with 201 and create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      const { status } = await server
        .post('/users/sign-up')
        .send(createUserDto);
      expect(status).toBe(HttpStatus.CREATED);

      const users = await prisma.user.findMany();
      expect(users).toHaveLength(1);
      const user = users[0];
      expect(user).toEqual({
        id: expect.any(Number),
        email: expect.any(String),
        password: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should respond with 400 if password is not security', async () => {
      const createUserDto: CreateUserDto = {
        email: 'myEmail@test.com',
        password: 'pass',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const { status } = await server
        .post('/users/sign-up')
        .send(createUserDto);
      expect(status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should respond with 409 if already exists email', async () => {
      const createUserDto: CreateUserDto = {
        email: 'myEmail@test.com',
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const { status } = await server
        .post('/users/sign-up')
        .send(createUserDto);
      expect(status).toBe(HttpStatus.CONFLICT);
    });
  });

  describe('POST /users/sign-in', () => {
    it('should respond with 200 if login is successful', async () => {
      const createUserDto: CreateUserDto = {
        email: 'myEmail@test.com',
        password: 'S#nh#F1rt#',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const { status, body } = await server
        .post('/users/sign-in')
        .send(createUserDto);
      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual({
        token: expect.any(String),
      });
    });

    it('should respond with 401 if login details are incorrect', async () => {
      const createUserDto: CreateUserDto = {
        email: 'myEmail@test.com',
        password: 'S#nh#F1rt#',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const { status } = await server
        .post('/users/sign-in')
        .send({ email: 'other@mail.com', password: 'Fakepass#1' });
      expect(status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});
