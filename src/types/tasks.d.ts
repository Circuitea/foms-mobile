import { User } from ".";

export interface Task {
  id: number;
  title: string;
  description: string;
  location: string;

  created_at: string;
  updated_at: string;
  finished_at: string | null;

  pivot: {
    started_at: string | null;
    finished_at: string | null;
    additional_notes: string | null;
  }

  type: TaskType;
  priority: TaskPriority;

  due_date: string;

  creator: User;
}

export interface TaskType {
  id: number;
  name: string;
}

export interface TaskPriority {
  id: number;
  name: string;
}
