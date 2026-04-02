import { TodoList } from "../todo_list.entity";

export class PaginatedTodoListDto {
  data!: TodoList[];
  total!: number;
  page!: number;
  lastPage!: number;
}