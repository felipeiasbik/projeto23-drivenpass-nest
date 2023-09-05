import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { E2EUtils } from './utils/e2e-utils';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { CreateCredentialDto } from '../src/credentials/dto/create-credential.dto';

describe('Credentials (e2e) Tests', () => {
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

  describe('POST /credentials', () => {
    it('should respond with 201 and create a credential', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const createCredentialDto: CreateCredentialDto = {
        title: faker.animal.bear(),
        url: faker.internet.url(),
        credentialsUser: faker.internet.userName(),
        credentialsPass: 'S@nh@F1rt@',
      };

      const { status, body } = await server
        .post('/credentials')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(createCredentialDto);

      expect(status).toBe(HttpStatus.CREATED);
      expect(body).toEqual({
        id: expect.any(Number),
        userId: expect.any(Number),
        title: expect.any(String),
        url: expect.any(String),
        credentialsUser: expect.any(String),
        credentialsPass: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      const credentials = await prisma.credential.findMany();
      expect(credentials).toHaveLength(1);
    });

    it('should respond with 400 if data is not sent correctly', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const { status } = await server
        .post('/credentials')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send({});

      expect(status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should respond with 409 if title already exists for user credential', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const createCredentialDto: CreateCredentialDto = {
        title: faker.animal.bear(),
        url: faker.internet.url(),
        credentialsUser: faker.internet.userName(),
        credentialsPass: 'S@nh@F1rt@',
      };

      await server
        .post('/credentials')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(createCredentialDto);

      const { status } = await server
        .post('/credentials')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(createCredentialDto);

      expect(status).toBe(HttpStatus.CONFLICT);
    });
  });

  describe('GET /credentials', () => {
    it('should respond with 200 and list user credentials', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const createCredentialDto: CreateCredentialDto = {
        title: faker.animal.bear(),
        url: faker.internet.url(),
        credentialsUser: faker.internet.userName(),
        credentialsPass: 'S@nh@F1rt@',
      };

      await server
        .post('/credentials')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(createCredentialDto);

      const { status, body } = await server
        .get('/credentials')
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual([
        {
          id: expect.any(Number),
          userId: expect.any(Number),
          title: expect.any(String),
          url: expect.any(String),
          credentialsUser: expect.any(String),
          credentialsPass: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });
  });
  describe('GET /credentials/:id', () => {
    it('should respond with 200 and the credential referring to the id', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const createCredentialDto: CreateCredentialDto = {
        title: faker.animal.bear(),
        url: faker.internet.url(),
        credentialsUser: faker.internet.userName(),
        credentialsPass: 'S@nh@F1rt@',
      };

      const credential = await server
        .post('/credentials')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(createCredentialDto);

      const { status, body } = await server
        .get(`/credentials/${credential.body.id}`)
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual({
        id: expect.any(Number),
        userId: expect.any(Number),
        title: expect.any(String),
        url: expect.any(String),
        credentialsUser: expect.any(String),
        credentialsPass: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should respond with 403 if credential is not user`s', async () => {
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

      const createCredentialDto: CreateCredentialDto = {
        title: faker.animal.bear(),
        url: faker.internet.url(),
        credentialsUser: faker.internet.userName(),
        credentialsPass: 'S@nh@F1rt@',
      };

      const credential = await server
        .post('/credentials')
        .set('Authorization', `Bearer ${loginUser1.body.token}`)
        .send(createCredentialDto);

      const { status } = await server
        .get(`/credentials/${credential.body.id}`)
        .set('Authorization', `Bearer ${loginUser2.body.token}`);

      expect(status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should respond with 404 if credential does not exist', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const { status } = await server
        .get('/credentials/99999')
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /credentials/:id', () => {
    it('should respond with 200 if credential is deleted', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const createCredentialDto: CreateCredentialDto = {
        title: faker.animal.bear(),
        url: faker.internet.url(),
        credentialsUser: faker.internet.userName(),
        credentialsPass: 'S@nh@F1rt@',
      };

      const credential = await server
        .post('/credentials')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(createCredentialDto);

      const { status } = await server
        .delete(`/credentials/${credential.body.id}`)
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(status).toBe(HttpStatus.OK);
    });

    it('should respond with 403 if credential is not user`s', async () => {
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

      const createCredentialDto: CreateCredentialDto = {
        title: faker.animal.bear(),
        url: faker.internet.url(),
        credentialsUser: faker.internet.userName(),
        credentialsPass: 'S@nh@F1rt@',
      };

      const credential = await server
        .post('/credentials')
        .set('Authorization', `Bearer ${loginUser1.body.token}`)
        .send(createCredentialDto);

      const { status } = await server
        .delete(`/credentials/${credential.body.id}`)
        .set('Authorization', `Bearer ${loginUser2.body.token}`);

      expect(status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should respond with 404 if credential does not exist', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const { status } = await server
        .delete('/credentials/99999')
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
