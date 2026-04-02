import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoList } from './todo_list.entity';
import { TodoListsService } from './todo_lists.service';
import { PaginatedTodoListDto } from './dtos/paginated-todo_list';
@Controller('api/todolists')
export class TodoListsController {
  constructor(private todoListsService: TodoListsService) {}

@Get()
findAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
): Promise<PaginatedTodoListDto> {
  return this.todoListsService.findAll(page, limit);
}

  @Get(':todoListId')
  findOne(
    @Param('todoListId', ParseIntPipe)  todoListId: number 
  ): Promise<TodoList> {
    return this.todoListsService.findOne(todoListId);
  }

  @Post()
  create(
    @Body() dto: CreateTodoListDto
  ): Promise<TodoList> {
    return this.todoListsService.create(dto);
  }

  @Put(':todoListId')
  update(
    @Param('todoListId', ParseIntPipe) todoListId: number,
    @Body() dto: UpdateTodoListDto,
  ): Promise<TodoList> {
    return this.todoListsService.update(todoListId, dto);
  }

  @Delete(':todoListId')
  @HttpCode(204)
  delete(
    @Param('todoListId', ParseIntPipe) todoListId: number
  ): Promise<void> {
    return this.todoListsService.delete(todoListId);
  }
}
