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
exports.ToDoController = void 0;
const common_1 = require("@nestjs/common");
const decorator_1 = require("../auth/decorator");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const todo_service_1 = require("./todo.service");
const create_todo_dto_1 = require("./dto/create-todo.dto");
const edit_todo_dto_1 = require("./dto/edit-todo.dto");
let ToDoController = class ToDoController {
    ToDoService;
    constructor(ToDoService) {
        this.ToDoService = ToDoService;
    }
    getToDos(userId) {
        return this.ToDoService.getToDos(userId);
    }
    getToDoById(userId, ToDoId) {
        return this.ToDoService.getToDoById(userId, ToDoId);
    }
    createToDo(userId, dto) {
        return this.ToDoService.createToDo(userId, dto);
    }
    editToDoById(userId, ToDoId, dto) {
        return this.ToDoService.editToDoById(userId, ToDoId, dto);
    }
    deleteToDoById(userId, ToDoId) {
        return this.ToDoService.deleteToDoById(userId, ToDoId);
    }
};
exports.ToDoController = ToDoController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ToDoController.prototype, "getToDos", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ToDoController.prototype, "getToDoById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_todo_dto_1.CreateToDoDto]),
    __metadata("design:returntype", void 0)
], ToDoController.prototype, "createToDo", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, edit_todo_dto_1.EditToDoDto]),
    __metadata("design:returntype", void 0)
], ToDoController.prototype, "editToDoById", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Delete)(':id'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ToDoController.prototype, "deleteToDoById", null);
exports.ToDoController = ToDoController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('todos'),
    __metadata("design:paramtypes", [todo_service_1.ToDoService])
], ToDoController);
//# sourceMappingURL=todo.controller.js.map