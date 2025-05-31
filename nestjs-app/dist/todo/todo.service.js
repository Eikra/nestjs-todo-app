"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToDoService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const prisma_service_1 = require("../prisma/prisma.service");
let ToDoService = class ToDoService {
    prisma;
    cacheManager;
    constructor(prisma, cacheManager) {
        this.prisma = prisma;
        this.cacheManager = cacheManager;
    }
    async getToDos(userId) {
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
        await this.cacheManager.set(cacheKey, todos, 60);
        return todos;
    }
    getToDoById(userId, todoId) {
        return this.prisma.toDo.findFirst({
            where: {
                id: todoId,
                userId,
            },
        });
    }
    async createToDo(userId, dto) {
        const todo = await this.prisma.toDo.create({
            data: {
                userId,
                title: dto.title,
                description: dto.description ?? "",
            },
        });
        await this.cacheManager.del(`user:${userId}:todos`);
        return todo;
    }
    async editToDoById(userId, todoId, dto) {
        const todo = await this.prisma.toDo.findUnique({
            where: {
                id: todoId,
            },
        });
        if (!todo || todo.userId !== userId)
            throw new common_1.ForbiddenException('Access to resources denied');
        const updated = await this.prisma.toDo.update({
            where: {
                id: todoId,
            },
            data: {
                ...dto,
            },
        });
        await this.cacheManager.del(`user:${userId}:todos`);
        return updated;
    }
    async deleteToDoById(userId, todoId) {
        const todo = await this.prisma.toDo.findUnique({
            where: {
                id: todoId,
            },
        });
        if (!todo || todo.userId !== userId)
            throw new common_1.ForbiddenException('Access to resources denied');
        await this.prisma.toDo.delete({
            where: {
                id: todoId,
            },
        });
        await this.cacheManager.del(`user:${userId}:todos`);
    }
};
exports.ToDoService = ToDoService;
exports.ToDoService = ToDoService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], ToDoService);
//# sourceMappingURL=todo.service.js.map