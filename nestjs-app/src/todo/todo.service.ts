import {
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateToDoDto } from './dto/create-todo.dto';
import { EditToDoDto } from './dto/edit-todo.dto';

@Injectable()
export class ToDoService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async getToDos(userId: number) {
    const cacheKey = `user:${userId}:todos`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const todos = await this.prisma.toDo.findMany({
      where: {
        userId,
      },
    });

    await this.cacheManager.set(cacheKey, todos, 60); // Cache for 60 seconds
    return todos;
  }

  getToDoById(userId: number, todoId: number) {
    return this.prisma.toDo.findFirst({
      where: {
        id: todoId,
        userId,
      },
    });
  }

  async createToDo(userId: number, dto: CreateToDoDto) {
    const todo = await this.prisma.toDo.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description ?? "",  // default empty string if undefined
      },
    });

    await this.cacheManager.del(`user:${userId}:todos`);
    return todo;
  }


  async editToDoById(
    userId: number,
    todoId: number,
    dto: EditToDoDto,
  ) {
    const todo = await this.prisma.toDo.findUnique({
      where: {
        id: todoId,
      },
    });

    if (!todo || todo.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    const updated = await this.prisma.toDo.update({
      where: {
        id: todoId,
      },
      data: {
        ...dto,
      },
    });

    await this.cacheManager.del(`user:${userId}:todos`); // Invalidate cache
    return updated;
  }





  async deleteToDoById(userId: number, todoId: number) {
    const todo = await this.prisma.toDo.findUnique({
      where: {
        id: todoId,
      },
    });

    if (!todo || todo.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.toDo.delete({
      where: {
        id: todoId,
      },
    });

    await this.cacheManager.del(`user:${userId}:todos`); // Invalidate cache
  }
}


// import {
//   ForbiddenException,
//   Injectable,
// } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import {
//   CreateToDoDto} from './dto/create-todo.dto';
// import {
//   EditToDoDto} from './dto/edit-todo.dto';

// @Injectable()
// export class ToDoService {
//   constructor(private prisma: PrismaService) {}

//   getToDos(userId: number) {
//     return this.prisma.toDo.findMany({
//       where: {
//         userId,
//       },
//     });
//   }

//   getToDoById(
//     userId: number,
//     todoId: number,
//   ) {
//     return this.prisma.toDo.findFirst({
//       where: {
//         id: todoId,
//         userId,
//       },
//     });
//   }

//   async createToDo(
//     userId: number,
//     dto: CreateToDoDto,
//   ) {
//     const todo =
//       await this.prisma.toDo.create({
//         data: {
//           userId,
//           ...dto,
//         },
//       });

//     return todo;
//   }

//   async editToDoById(
//     userId: number,
//     todoId: number,
//     dto: EditToDoDto,
//   ) {
//     // get the todo by id
//     const todo =
//       await this.prisma.toDo.findUnique({
//         where: {
//           id: todoId,
//         },
//       });

//     // check if user owns the todo
//     if (!todo || todo.userId !== userId)
//       throw new ForbiddenException(
//         'Access to resources denied',
//       );

//     return this.prisma.toDo.update({
//       where: {
//         id: todoId,
//       },
//       data: {
//         ...dto,
//       },
//     });
//   }

//   async deleteToDoById(
//     userId: number,
//     todoId: number,
//   ) {
//     const todo =
//       await this.prisma.toDo.findUnique({
//         where: {
//           id: todoId,
//         },
//       });

//     // check if user owns the todo
//     if (!todo || todo.userId !== userId)
//       throw new ForbiddenException(
//         'Access to resources denied',
//       );

//     await this.prisma.toDo.delete({
//       where: {
//         id: todoId,
//       },
//     });
//   }
// }