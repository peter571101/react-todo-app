import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import dayjs from 'dayjs';

export interface Todo {
  id: string;
  name: string;
  status: 'completed' | 'pending';
  createdAt: string;
  updatedAt: string;
}

interface TodoStore {
  todos: Todo[];
  inputValue: string;
  selectedIds: Set<string>;
  editingTodo: Todo | null;
  isDeleteModalOpen: boolean;
  todoToDelete: string | null;

  // Actions
  setInputValue: (value: string) => void;
  addTodo: (name: string) => void;
  toggleSelect: (id: string) => void;
  toggleAll: () => void;
  deleteBatch: () => void;
  toggleStatus: (id: string) => void;
  setEditingTodo: (todo: Todo | null) => void;
  saveEdit: () => void;
  confirmDelete: (id: string) => void;
  handleDelete: () => void;
  closeDeleteModal: () => void;
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      inputValue: '',
      selectedIds: new Set(),
      editingTodo: null,
      isDeleteModalOpen: false,
      todoToDelete: null,

      setInputValue: (value) => set({ inputValue: value }),

      addTodo: (name) => {
        const now = dayjs().format('YYYY/MM/DD HH:mm:ss');
        const newTodo: Todo = {
          id: crypto.randomUUID(),
          name,
          status: 'pending',
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          todos: [newTodo, ...state.todos],
          inputValue: '',
        }));
      },

      toggleSelect: (id) => {
        set((state) => {
          const next = new Set(state.selectedIds);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return { selectedIds: next };
        });
      },

      toggleAll: () => {
        set((state) => {
          const { todos, selectedIds } = state;
          if (selectedIds.size === todos.length && todos.length > 0) {
            return { selectedIds: new Set() };
          } else {
            return { selectedIds: new Set(todos.map(t => t.id)) };
          }
        });
      },

      deleteBatch: () => {
        set((state) => ({
          todos: state.todos.filter(t => !state.selectedIds.has(t.id)),
          selectedIds: new Set(),
        }));
      },

      toggleStatus: (id) => {
        set((state) => ({
          todos: state.todos.map(t =>
            t.id === id
              ? {
                  ...t,
                  status: t.status === 'completed' ? 'pending' : 'completed',
                  updatedAt: dayjs().format('YYYY/MM/DD HH:mm:ss'),
                }
              : t
          ),
        }));
      },

      setEditingTodo: (todo) => set({ editingTodo: todo }),

      saveEdit: () => {
        const { editingTodo } = get();
        if (!editingTodo) return;

        set((state) => ({
          todos: state.todos.map(t =>
            t.id === editingTodo.id
              ? { ...editingTodo, updatedAt: dayjs().format('YYYY/MM/DD HH:mm:ss') }
              : t
          ),
          editingTodo: null,
        }));
      },

      confirmDelete: (id) => set({ todoToDelete: id, isDeleteModalOpen: true }),

      handleDelete: () => {
        const { todoToDelete } = get();
        if (!todoToDelete) return;

        set((state) => ({
          todos: state.todos.filter(t => t.id !== todoToDelete),
          isDeleteModalOpen: false,
          todoToDelete: null,
        }));
      },

      closeDeleteModal: () => set({ isDeleteModalOpen: false, todoToDelete: null }),
    }),
    {
      name: 'todo-store',
      partialize: (state) => ({ todos: state.todos }), // 只持久化 todos
    }
  )
);