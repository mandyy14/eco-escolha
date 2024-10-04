export interface Target {
  id: number;
  title?: string;
  isComplete: boolean;
  description?: string;
  todo?: Todo[];
}

export interface Todo {
  id: number;
  title?: string;
  isComplete: boolean;
  description?: string;
  targetId: number;
}
