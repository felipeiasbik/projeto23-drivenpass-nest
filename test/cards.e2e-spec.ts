import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { E2EUtils } from './utils/e2e-utils';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { CreateCardDto } from '../src/cards/dto/create-card.dto';

describe('Cards (e2e) Tests', () => {
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

  describe('POST /cards', () => {
    it('should respond with 201 and create a card', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const createCardDto: CreateCardDto = {
        title: faker.animal.bear(),
        cardName: faker.person.fullName(),
        cardNumber: faker.number.int({ max: 16, min: 16 }).toString(),
        cardCvv: faker.number.int({ max: 3, min: 3 }).toString(),
        cardExpiration: faker.number.int({ max: 4, min: 4 }).toString(),
        cardPass: faker.number.int({ max: 6, min: 6 }).toString(),
        cardTypeId: faker.number.int({ max: 3, min: 1 }),
        virtualCard: faker.datatype.boolean(),
      };

      const { status, body } = await server
        .post('/cards')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(createCardDto);

      expect(status).toBe(HttpStatus.CREATED);
      expect(body).toEqual({
        id: expect.any(Number),
        userId: expect.any(Number),
        title: expect.any(String),
        cardName: expect.any(String),
        cardNumber: expect.any(String),
        cardCvv: expect.any(String),
        cardExpiration: expect.any(String),
        virtualCard: expect.any(Boolean),
        cardPass: expect.any(String),
        cardTypeId: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        cardType: {
          type: expect.any(String),
        },
      });

      const cards = await prisma.card.findMany();
      expect(cards).toHaveLength(1);
    });

    it('should respond with 400 if data is not sent correctly', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const { status } = await server
        .post('/cards')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send({});

      expect(status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should respond with 409 if title already exists for user card', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const createCardDto: CreateCardDto = {
        title: faker.animal.bear(),
        cardName: faker.person.fullName(),
        cardNumber: faker.number.int({ max: 16, min: 16 }).toString(),
        cardCvv: faker.number.int({ max: 3, min: 3 }).toString(),
        cardExpiration: faker.number.int({ max: 4, min: 4 }).toString(),
        cardPass: faker.number.int({ max: 6, min: 6 }).toString(),
        cardTypeId: faker.number.int({ max: 3, min: 1 }),
        virtualCard: faker.datatype.boolean(),
      };

      await server
        .post('/cards')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(createCardDto);

      const { status } = await server
        .post('/cards')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(createCardDto);

      expect(status).toBe(HttpStatus.CONFLICT);
    });
  });

  describe('GET /cards', () => {
    it('should respond with 200 and list user cards', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const createCardDto: CreateCardDto = {
        title: faker.animal.bear(),
        cardName: faker.person.fullName(),
        cardNumber: faker.number.int({ max: 16, min: 16 }).toString(),
        cardCvv: faker.number.int({ max: 3, min: 3 }).toString(),
        cardExpiration: faker.number.int({ max: 4, min: 4 }).toString(),
        cardPass: faker.number.int({ max: 6, min: 6 }).toString(),
        cardTypeId: faker.number.int({ max: 3, min: 1 }),
        virtualCard: faker.datatype.boolean(),
      };

      await server
        .post('/cards')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(createCardDto);

      const { status, body } = await server
        .get('/cards')
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual([
        {
          id: expect.any(Number),
          userId: expect.any(Number),
          title: expect.any(String),
          cardName: expect.any(String),
          cardNumber: expect.any(String),
          cardCvv: expect.any(String),
          cardExpiration: expect.any(String),
          virtualCard: expect.any(Boolean),
          cardPass: expect.any(String),
          cardTypeId: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          cardType: {
            type: expect.any(String),
          },
        },
      ]);
    });
  });
  describe('GET /cards/:id', () => {
    it('should respond with 200 and the card referring to the id', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const createCardDto: CreateCardDto = {
        title: faker.animal.bear(),
        cardName: faker.person.fullName(),
        cardNumber: faker.number.int({ max: 16, min: 16 }).toString(),
        cardCvv: faker.number.int({ max: 3, min: 3 }).toString(),
        cardExpiration: faker.number.int({ max: 4, min: 4 }).toString(),
        cardPass: faker.number.int({ max: 6, min: 6 }).toString(),
        cardTypeId: faker.number.int({ max: 3, min: 1 }),
        virtualCard: faker.datatype.boolean(),
      };

      const card = await server
        .post('/cards')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(createCardDto);

      const { status, body } = await server
        .get(`/cards/${card.body.id}`)
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual({
        id: expect.any(Number),
        userId: expect.any(Number),
        title: expect.any(String),
        cardName: expect.any(String),
        cardNumber: expect.any(String),
        cardCvv: expect.any(String),
        cardExpiration: expect.any(String),
        virtualCard: expect.any(Boolean),
        cardPass: expect.any(String),
        cardTypeId: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        cardType: {
          type: expect.any(String),
        },
      });
    });

    it('should respond with 403 if card is not user`s', async () => {
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

      const createCardDto: CreateCardDto = {
        title: faker.animal.bear(),
        cardName: faker.person.fullName(),
        cardNumber: faker.number.int({ max: 16, min: 16 }).toString(),
        cardCvv: faker.number.int({ max: 3, min: 3 }).toString(),
        cardExpiration: faker.number.int({ max: 4, min: 4 }).toString(),
        cardPass: faker.number.int({ max: 6, min: 6 }).toString(),
        cardTypeId: faker.number.int({ max: 3, min: 1 }),
        virtualCard: faker.datatype.boolean(),
      };

      const card = await server
        .post('/cards')
        .set('Authorization', `Bearer ${loginUser1.body.token}`)
        .send(createCardDto);

      const { status } = await server
        .get(`/cards/${card.body.id}`)
        .set('Authorization', `Bearer ${loginUser2.body.token}`);

      expect(status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should respond with 404 if card does not exist', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const { status } = await server
        .get('/cards/99999')
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /cards/:id', () => {
    it('should respond with 200 if card is deleted', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const createCardDto: CreateCardDto = {
        title: faker.animal.bear(),
        cardName: faker.person.fullName(),
        cardNumber: faker.number.int({ max: 16, min: 16 }).toString(),
        cardCvv: faker.number.int({ max: 3, min: 3 }).toString(),
        cardExpiration: faker.number.int({ max: 4, min: 4 }).toString(),
        cardPass: faker.number.int({ max: 6, min: 6 }).toString(),
        cardTypeId: faker.number.int({ max: 3, min: 1 }),
        virtualCard: faker.datatype.boolean(),
      };

      const card = await server
        .post('/cards')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(createCardDto);

      const { status } = await server
        .delete(`/cards/${card.body.id}`)
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(status).toBe(HttpStatus.OK);
    });

    it('should respond with 403 if card is not user`s', async () => {
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

      const createCardDto: CreateCardDto = {
        title: faker.animal.bear(),
        cardName: faker.person.fullName(),
        cardNumber: faker.number.int({ max: 16, min: 16 }).toString(),
        cardCvv: faker.number.int({ max: 3, min: 3 }).toString(),
        cardExpiration: faker.number.int({ max: 4, min: 4 }).toString(),
        cardPass: faker.number.int({ max: 6, min: 6 }).toString(),
        cardTypeId: faker.number.int({ max: 3, min: 1 }),
        virtualCard: faker.datatype.boolean(),
      };

      const card = await server
        .post('/cards')
        .set('Authorization', `Bearer ${loginUser1.body.token}`)
        .send(createCardDto);

      const { status } = await server
        .delete(`/cards/${card.body.id}`)
        .set('Authorization', `Bearer ${loginUser2.body.token}`);

      expect(status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should respond with 404 if card does not exist', async () => {
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: 'S@nh@F1rt@',
      };

      await server.post('/users/sign-up').send(createUserDto);

      const login = await server.post('/users/sign-in').send(createUserDto);

      const { status } = await server
        .delete('/cards/99999')
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
