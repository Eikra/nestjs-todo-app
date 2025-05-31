import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateToDoDto } from './dto/create-todo.dto';
import { EditToDoDto } from './dto/edit-todo.dto';
export declare class ToDoService {
    private prisma;
    private cacheManager;
    constructor(prisma: PrismaService, cacheManager: Cache);
    getToDos(userId: number): Promise<{}>;
    getToDoById(userId: number, todoId: number): import(".prisma/client").Prisma.Prisma__ToDoClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        completed: boolean;
        userId: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    createToDo(userId: number, dto: CreateToDoDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        completed: boolean;
        userId: number;
    }>;
    editToDoById(userId: number, todoId: number, dto: EditToDoDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        completed: boolean;
        userId: number;
    }>;
    deleteToDoById(userId: number, todoId: number): Promise<void>;
}
