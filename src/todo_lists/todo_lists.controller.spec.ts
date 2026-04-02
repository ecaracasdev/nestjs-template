import { Test, TestingModule } from '@nestjs/testing';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoList } from './todo_list.entity';

describe('TodoListsController', () => {
  // let app: INestApplication;
  let todoListsController: TodoListsController;
  // let todoListRepositoryMock: jest.Mocked<Record<string, jest.Mock>>;
  let todoListsService: jest.Mocked<TodoListsService>;

  beforeEach(async () => {
    todoListsService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoListsController],
      providers: [
        {
          provide: TodoListsService,
          useValue: todoListsService,
        },
      ],
    }).compile();

    todoListsController = module.get<TodoListsController>(TodoListsController);
  });

  // afterAll(async () => {
  //   await app.close();
  // });

  describe('findAll', () => {
    it('should return paginated todo lists', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            name: 'Shopping List',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            name: 'Work Tasks',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 2,
        page: 1,
        lastPage: 1,
      };

      todoListsService.findAll.mockResolvedValue(mockResponse);

      const result = await todoListsController.findAll(1, 10);

      expect(todoListsService.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should return a single todo list by id', async () => {
      const mockTodoList = {
        id: 1,
        name: 'Shopping List',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      todoListsService.findOne.mockResolvedValue(mockTodoList);

      const result = await todoListsController.findOne(1);

      expect(todoListsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTodoList);
    });
  });

  describe('create', () => {
    it('should create a new todo list', async () => {
      const createDto = { name: 'New List' };

      const mockCreatedTodoList = {
        id: 1,
        name: 'New List',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      todoListsService.create.mockResolvedValue(mockCreatedTodoList);

      const result = await todoListsController.create(createDto);

      expect(todoListsService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockCreatedTodoList);
    });
  });

  describe('update', () => {
    it('should update an existing todo list', async () => {
      const updateDto = { name: 'Updated List' };

      const updatedTodoList = {
        id: 1,
        name: 'Updated List',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      todoListsService.update.mockResolvedValue(updatedTodoList);

      const result = await todoListsController.update(1, updateDto);

      expect(todoListsService.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedTodoList);
    });
  });

  describe('delete', () => {
    it('should delete a todo list', async () => {
      todoListsService.delete.mockResolvedValue(undefined);

      await todoListsController.delete(1);

      expect(todoListsService.delete).toHaveBeenCalledWith(1);
    });
    it('should throw NotFoundException if not found', async () => {
      todoListsService.delete.mockRejectedValue(
        new NotFoundException()
      );

      await expect(todoListsController.delete(1)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
