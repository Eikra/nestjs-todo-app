import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { AuthDto } from './../src/auth/dto/auth.dto';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { EditUserDto } from './../src/user/dto/edit-user.dto';
import { CreateToDoDto } from './../src/todo/dto/create-todo.dto';
import { EditToDoDto } from './../src/todo/dto/edit-todo.dto';
import * as pactum from 'pactum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';

import { Cache } from 'cache-manager';
import { ToDoService } from './../src/todo/todo.service';
import { after } from 'node:test';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let serverport: number;
  serverport = 3001; // Set the port for the application

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );



    await app.init();

    serverport += 1; // Increment the port for the next test run
    await app.listen(serverport);
    pactum.request.setBaseUrl(`http://localhost:${serverport}`); // Use template literal to set the base URL with the current port


    prisma = moduleFixture.get<PrismaService>(PrismaService);
    if (serverport === 3002) {
      await prisma.cleanDb(); // Ensure the database is clean before each test
    }

  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  // afterEach(async () => {
  //   console.log('Closing app...');
  //   await app.close();
  //   console.log('Disconnecting Prisma...');
  //   await prisma.$disconnect();
  //   console.log('Done cleanup.');
  // });

  afterAll(async () => {
    console.log('Closing app...');
    await app.close();
    console.log('Disconnecting Prisma...');
    await prisma.$disconnect();
    console.log('Done cleanup.');
  });




  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'ikrame@gmail.com',
      password: '123',
    };


    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post(`http://localhost:${serverport}/auth/signup`)
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });




    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'iecharak',
          email: 'ikrame@sygar.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('todos', () => {
    describe('Get empty todos', () => {
      it('should get todos', () => {
        return pactum
          .spec()
          .get('/todos')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]); // Expect empty array initially
      });
    });

    describe('Create todo', () => {
      const dto: CreateToDoDto = {
        title: 'First todo',
        description: 'This is my first todo item',
      };
      it('should create todo', () => {
        return pactum
          .spec()
          .post('/todos')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('todoId', 'id'); // Save the new todo ID for later tests
      });
    });

    describe('Get todos', () => {
      it('should get todos', () => {
        return pactum
          .spec()
          .get('/todos')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1); // Now there should be exactly 1 todo
      });
    });

    describe('Get todo by id', () => {
      it('should get todo by id', () => {
        return pactum
          .spec()
          .get('/todos/{id}')
          .withPathParams('id', '$S{todoId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{todoId}'); // Make sure response contains the correct todo id
      });
    });



    describe('Edit todo by id', () => {
      const dto: EditToDoDto = {
        title:
          'DJANGO INTERVIEW',
        description:
          'BEFORE 3 JUNE 2025',
      };
      it('should edit todo', () => {
        return pactum
          .spec()
          .patch('/todos/{id}')
          .withPathParams('id', '$S{todoId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    
describe('Edit todo by id - completed field', () => {
  it('should update completed field to true', () => {
    return pactum
      .spec()
      .patch('/todos/{id}')
      .withPathParams('id', '$S{todoId}')
      .withHeaders({
        Authorization: 'Bearer $S{userAt}',
      })
      .withBody({ completed: true })
      .expectStatus(200)
      .expectBodyContains('"completed":true');
  });

  it('should update completed field back to false', () => {
    return pactum
      .spec()
      .patch('/todos/{id}')
      .withPathParams('id', '$S{todoId}')
      .withHeaders({
        Authorization: 'Bearer $S{userAt}',
      })
      .withBody({ completed: false })
      .expectStatus(200)
      .expectBodyContains('"completed":false');
  });
});

    
    

    describe('Delete todo by id', () => {
      it('should delete todo', () => {
        return pactum
          .spec()
          .delete('/todos/{id}')
          .withPathParams('id', '$S{todoId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });

      it('should get empty todos', () => {
        return pactum
          .spec()
          .get('/todos')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0); // No todos after deletion
      });
    });
  });



describe('ToDoService - Redis Caching', () => {
  let service: ToDoService;
  let prisma: PrismaService;
  let cache: Cache;

  const mockUserId = 1;
  const mockTodos = [
    { id: 1, title: 'Learn Redis', description: '', userId: mockUserId, completed: false },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        ToDoService,
        PrismaService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ToDoService>(ToDoService);
    prisma = module.get<PrismaService>(PrismaService);
    cache = module.get<Cache>(CACHE_MANAGER);
  });

  it('should return cached todos if available', async () => {
    jest.spyOn(cache, 'get').mockResolvedValue(mockTodos);

    const result = await service.getToDos(mockUserId);

    expect(cache.get).toHaveBeenCalledWith(`user:${mockUserId}:todos`);
    expect(result).toEqual(mockTodos);
  });

  it('should fetch from DB and cache if not cached', async () => {
    jest.spyOn(cache, 'get').mockResolvedValue(undefined);
    jest.spyOn(prisma.toDo, 'findMany').mockResolvedValue(mockTodos as any);
    const setSpy = jest.spyOn(cache, 'set');

    const result = await service.getToDos(mockUserId);

    expect(prisma.toDo.findMany).toHaveBeenCalledWith({ where: { userId: mockUserId } });
    expect(setSpy).toHaveBeenCalledWith(`user:${mockUserId}:todos`, mockTodos, 60);
    expect(result).toEqual(mockTodos);
  });
});


});
