export interface TodoState {
  list: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export type Todo = {
  id: number;
  title: string;
  createdDate: string;
  completed: boolean;
  completedDate?: string;
  priority: number;
  description: string;
  assignedDate: string;
};
