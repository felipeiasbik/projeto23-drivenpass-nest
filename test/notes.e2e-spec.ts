import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { E2EUtils } from './utils/e2e-utils';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { CreateNoteDto } from '../src/notes/dto/create-note.dto';

describe('Notes (e2e) Tests', () => {
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

  describe('POST /notes', () => {
    it('should respond with 201 and create a note', async () => {
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

      const { status, body } = await server
        .post('/notes')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(createNoteDto);

      expect(status).toBe(HttpStatus.CREATED);
      expect(body).toEqual({
        id: expect.any(Number),
        userId: expect.any(Number),
        title: expect.any(String),
        text: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      const notes = await prisma.note.findMany();
      expect(notes).toHaveLength(1);
    });

    it('should respond with 400 if data is not sent correctly', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const { status } = await server
        .post('/notes')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send({});

      expect(status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should respond with 409 if title already exists for user note', async () => {
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

      const { status } = await server
        .post('/notes')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(createNoteDto);

      expect(status).toBe(HttpStatus.CONFLICT);
    });
  });

  describe('GET /notes', () => {
    it('should respond with 200 and list user notes', async () => {
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

      const { status, body } = await server
        .get('/notes')
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual([
        {
          id: expect.any(Number),
          userId: expect.any(Number),
          title: expect.any(String),
          text: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });
  });

  describe('GET /notes/:id', () => {
    it('should respond with 200 and the note referring to the id', async () => {
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

      const note = await server
        .post('/notes')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(createNoteDto);

      const { status, body } = await server
        .get(`/notes/${note.body.id}`)
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual({
        id: expect.any(Number),
        userId: expect.any(Number),
        title: expect.any(String),
        text: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should respond with 403 if note is not user`s', async () => {
      const createUserDto1: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      const createUserDto2: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S#nh#F1rt#',
      };

      await server.post('/users/sign-up').send(createUserDto1);
      await server.post('/users/sign-up').send(createUserDto2);

      const loginUser1 = await server
        .post('/users/sign-in')
        .send(createUserDto1);
      const loginUser2 = await server
        .post('/users/sign-in')
        .send(createUserDto2);

      const createNoteDto: CreateNoteDto = {
        title: faker.animal.bear(),
        text: faker.lorem.paragraph(),
      };

      const note = await server
        .post('/notes')
        .set('Authorization', `Bearer ${loginUser1.body.token}`)
        .send(createNoteDto);

      const { status } = await server
        .get(`/notes/${note.body.id}`)
        .set('Authorization', `Bearer ${loginUser2.body.token}`);

      expect(status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should respond with 404 if note does not exist', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const { status } = await server
        .get('/notes/99999')
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should respond with 200 if note is deleted', async () => {
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

      const note = await server
        .post('/notes')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(createNoteDto);

      const { status } = await server
        .delete(`/notes/${note.body.id}`)
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(status).toBe(HttpStatus.OK);
    });

    it('should respond with 403 if note is not user`s', async () => {
      const createUserDto1: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      const createUserDto2: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S#nh#F1rt#',
      };

      await server.post('/users/sign-up').send(createUserDto1);
      await server.post('/users/sign-up').send(createUserDto2);

      const loginUser1 = await server
        .post('/users/sign-in')
        .send(createUserDto1);
      const loginUser2 = await server
        .post('/users/sign-in')
        .send(createUserDto2);

      const createNoteDto: CreateNoteDto = {
        title: faker.animal.bear(),
        text: faker.lorem.paragraph(),
      };

      const note = await server
        .post('/notes')
        .set('Authorization', `Bearer ${loginUser1.body.token}`)
        .send(createNoteDto);

      const { status } = await server
        .delete(`/notes/${note.body.id}`)
        .set('Authorization', `Bearer ${loginUser2.body.token}`);

      expect(status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should respond with 404 if note does not exist', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const { status } = await server
        .delete('/notes/99999')
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
