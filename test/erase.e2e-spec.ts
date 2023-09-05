import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { E2EUtils } from './utils/e2e-utils';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { CreateNoteDto } from '../src/notes/dto/create-note.dto';
import { EraseUserDto } from '../src/erase/dto/erase.dto';

describe('Erase (e2e) Tests', () => {
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

  describe('DELETE /erase', () => {
    it('should respond with 200 and delete user', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const createNoteDto: CreateNoteDto = {
        title: faker.animal.bear(),
        text: faker.lorem.paragraph(),
      };

      await server
        .post('/notes')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(createNoteDto);

      const eraseUserDto: EraseUserDto = {
        password: createUserDto.password,
      };

      const { status } = await server
        .delete('/erase')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(eraseUserDto);

      expect(status).toBe(HttpStatus.OK);
    });

    it('should return 401 if password is incorrect', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const eraseUserDto: EraseUserDto = {
        password: 'Incorrec1P@ss',
      };

      const { status } = await server
        .delete('/erase')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(eraseUserDto);

      expect(status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});
