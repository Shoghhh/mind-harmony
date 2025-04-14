export interface TodoState {
  list: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}
export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  priority: number;
  description: string;
  timeSpent: number;
  createdAt: Timestamp;
  assignedDate: Timestamp;
  completedDate: Timestamp | null;
};