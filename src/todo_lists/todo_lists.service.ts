import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoList } from './todo_list.entity';

@Injectable()
export class TodoListsService {
  constructor(
    @InjectRepository(TodoList)
    private readonly todoListRepository: Repository<TodoList>,
  ) {}

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.todoListRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<TodoList> {
    const todoList = await this.todoListRepository.findOneBy({ id });

    if (!todoList) {
      throw new NotFoundException(`Todo list with id ${id} not found`);
    }
    return todoList;
  }

  async create(dto: CreateTodoListDto): Promise<TodoList> {
    const todo = this.todoListRepository.create(dto);
    return this.todoListRepository.save(todo);
  }

  async update(id: number, dto: UpdateTodoListDto): Promise<TodoList> {
    const todo = await this.findOne(id);
    const updated = this.todoListRepository.merge(todo, dto);
    return this.todoListRepository.save(updated);
  }

  async delete(id: number): Promise<void> {
    const result = await this.todoListRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo list with id ${id} not found`);
    }
  }
}
