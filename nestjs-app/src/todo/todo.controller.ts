import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ToDoService } from './todo.service';

import {
  CreateToDoDto} from './dto/create-todo.dto';
import {
  EditToDoDto} from './dto/edit-todo.dto';

@UseGuards(JwtGuard)
@Controller('todos')
export class ToDoController {
  constructor(
    private ToDoService: ToDoService,
  ) {}

  @Get()
  getToDos(@GetUser('id') userId: number) {
    return this.ToDoService.getToDos(
      userId,
    );
  }

  @Get(':id')
  getToDoById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) ToDoId: number,
  ) {
    return this.ToDoService.getToDoById(
      userId,
      ToDoId,
    );
  }

  @Post()
  createToDo(
    @GetUser('id') userId: number,
    @Body() dto: CreateToDoDto,
  ) {
    return this.ToDoService.createToDo(
      userId,
      dto,
    );
  }

  @Patch(':id')
  editToDoById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) ToDoId: number,
    @Body() dto: EditToDoDto,
  ) {
    return this.ToDoService.editToDoById(
      userId,
      ToDoId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteToDoById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) ToDoId: number,
  ) {
    return this.ToDoService.deleteToDoById(
      userId,
      ToDoId,
    );
  }
}