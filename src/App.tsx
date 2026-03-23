import React, { useState, useEffect } from "react";
import { type ClassValue, clsx } from "clsx";
import { Plus, Trash2, Lock, LockOpen, Clock, Pencil, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import "./App.css";
import dayjs from "dayjs";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Todo {
  id: string;
  name: string;
  status: "completed" | "pending";
  createdAt: string;
  updatedAt: string;
}

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todo-list-data");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("todo-list-data", JSON.stringify(todos));
  }, [todos]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const now = dayjs().format("YYYY/MM/DD HH:mm:ss");
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      name: inputValue,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    setTodos([newTodo, ...todos]);
    setInputValue("");
  };

  const deleteBatch = () => {
    setTodos(todos.filter((t) => !selectedIds.has(t.id)));
    setSelectedIds(new Set());
  };

  const toggleAll = () => {
    if (selectedIds.size === todos.length && todos.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(todos.map((t) => t.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleStatus = (id: string) => {
    setTodos(
      todos.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === "completed" ? "pending" : "completed";
          return {
            ...t,
            status: nextStatus,
            updatedAt: dayjs().format("YYYY/MM/DD HH:mm:ss"),
          };
        }
        return t;
      }),
    );
  };

  const handleEdit = (todo: Todo) => setEditingTodo({ ...todo });

  const confirmDelete = (id: string) => {
    setTodoToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const saveEdit = () => {
    if (!editingTodo) return;
    setTodos(
      todos.map((t) =>
        t.id === editingTodo.id
          ? { ...editingTodo, updatedAt: dayjs().format("YYYY/MM/DD HH:mm:ss") }
          : t,
      ),
    );
    setEditingTodo(null);
  };

  const handleDelete = () => {
    if (todoToDelete) {
      setTodos(todos.filter((t) => t.id !== todoToDelete));
      setIsDeleteModalOpen(false);
      setTodoToDelete(null);
    }
  };
  const completedCount = todos.filter((t) => t.status === "completed").length;

  return (
    <div className="min-h-screen bg-[#eef2f7] w-full flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-white/50">
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-center mb-10 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            待办事项清单
          </h1>
          <form onSubmit={handleAdd} className="flex gap-4 mb-8">
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="添加新的待办事项..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full h-14 pl-6 pr-12 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-gray-700"
              />
            </div>
            <button
              type="submit"
              className="px-6 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
            >
              <Plus size={20} />
            </button>
          </form>

          <div className="flex justify-between items-center mb-6 px-2">
            <div className="text-gray-500 flex gap-4 text-sm font-medium">
              <span>
                总计: <span className="text-bue-600">{todos.length}</span>
              </span>
              <span>
                已完成: <span className="text-green-600">{completedCount}</span>
              </span>
              <span>
                待完成:{" "}
                <span className="text-orange-600">
                  {todos.length - completedCount}
                </span>
              </span>
            </div>
            <button
              onClick={deleteBatch}
              disabled={selectedIds.size === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400
              border border-gray-100 rounded-xl hover:bg-red-50
              hover:text-red-500 disabled:opacity-30
              disabled:hover:bg-transparent transition-all"
            >
              <Trash2 size={16} /> 批量删除
            </button>
          </div>
          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-gray-50/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm font-semibold border-b border-gray-100">
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={
                        todos.length > 0 && selectedIds.size === todos.length
                      }
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="p-4">名称</th>
                  <th className="p-4">状态</th>
                  <th className="p-4">创建时间</th>
                  <th className="p-4">修改时间</th>
                  <th className="p-4 w-32 text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {todos.map((todo) => (
                  <tr
                    key={todo.id}
                    className="group hover:bg-white transition-colors border-b border-gray-50 last:border-0"
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={selectedIds.has(todo.id)}
                        onChange={() => toggleSelect(todo.id)}
                      />
                    </td>
                    <td
                      className={cn(
                        "p-4 font-medium transition-all duration-300",
                        todo.status === "completed"
                          ? "text-gray-400 line-through decoration-gray-300"
                          : "text-gray-700",
                      )}
                    >
                      {todo.name}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-semibold transition-colors",
                            todo.status === "completed"
                              ? "bg-[#00c853] text-white"
                              : "bg-gray-100 text-gray-500",
                          )}
                        >
                          {todo.status === "completed" ? "已完成" : "待完成"}
                        </span>
                        <button
                          onClick={() => toggleStatus(todo.id)}
                          className={cn(
                            "w-8 h-8 flex items-center justify-center rounded-lg transition-all active:scale-90 group/btn relative",
                            todo.status === "completed"
                              ? "bg-blue-50 text-blue-600 shadow-sm"
                              : "text-gray-800 hover:bg-gray-100",
                          )}
                        >
                          {todo.status === "completed" ? (
                            <Lock
                              size={18}
                              className="animate-in fade-in zoom-in duration-300"
                            />
                          ) : (
                            <LockOpen
                              size={18}
                              className="animate-in fade-in zoom-in duration-300"
                            />
                          )}

                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 font-normal">
                            标记为
                            {todo.status === "completed" ? "待完成" : "已完成"}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {todo.createdAt}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {todo.updatedAt}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(todo)}
                          className="p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-500 rounded-xl transition-all"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(todo.id)}
                          className="p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-500 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal
        isOpen={!!editingTodo}
        onClose={() => setEditingTodo(null)}
        title="编辑待办事项"
      >
        <p className="text-sm text-gray-400 mb-6">修改待办事项的名称</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              待办事项名称 *
            </label>
            <input
              type="text"
              value={editingTodo?.name || ""}
              onChange={(e) =>
                setEditingTodo((prev) =>
                  prev ? { ...prev, name: e.target.value } : null,
                )
              }
              className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
            <button
              onClick={() => setEditingTodo(null)}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-medium"
            >
              取消
            </button>
            <button
              onClick={saveEdit}
              className="px-8 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black transition-all font-medium shadow-lg shadow-gray-200"
            >
              保存
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="确认删除"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="text-red-500" size={32} />
          </div>
          <h4 className="text-lg font-bold text-gray-800 mb-2">确认删除</h4>
          <p className="text-gray-500 mb-8 px-4">
            确定要删除这个待办事项吗？此操作无法撤销。
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-8 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-medium min-w-[120px]"
            >
              取消
            </button>
            <button
              onClick={handleDelete}
              className="px-8 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all font-medium shadow-lg shadow-red-200 min-w-[120px]"
            >
              删除
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
