import { Trash2 } from "lucide-react";
import { useTodoStore } from "../stores/useTodoStore";

const TodoStats = () => {
  const { todos, selectedIds, deleteBatch } = useTodoStore();
  const completedTodo = todos.filter((t) => t.status === "completed").length;

  return (
    <div className="flex justify-between mb-6 px-2">
      <div className="flex gap-4">
        <span>
          总计：<span className="text-blue-600">{todos.length}</span>
        </span>
        <span>
          已完成： <span className="text-green-600">{completedTodo}</span>
        </span>
        <span>
          未完成：
          <span className="text-red-600">{todos.length - completedTodo}</span>
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
        <Trash2 size={16} />
        批量删除
      </button>
    </div>
  );
};

export default TodoStats;