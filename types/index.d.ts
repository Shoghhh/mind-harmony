export interface TodoState {
  list: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}
export type Todo = {
  id: string;
  title: string;
  createdAt: Timestamp | string;
  completed: boolean;
  completedDate: Timestamp | string | null;
  priority: number;
  description: string;
  assignedDate: Timestamp | string;
  timeSpent: number;
};