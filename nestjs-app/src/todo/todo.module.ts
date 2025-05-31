import { Module } from '@nestjs/common';
import { ToDoService } from './todo.service';
import { ToDoController } from './todo.controller';

@Module({
  controllers: [ToDoController],
  providers: [ToDoService],
})
export class ToDoModule {}
