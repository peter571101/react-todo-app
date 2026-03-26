import { Lock, LockOpen, Clock, Pencil, Trash2 } from "lucide-react";
import { useTodoStore, type Todo } from "../stores/useTodoStore";
import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TodoTable = () => {
  const {
    todos,
    selectedIds,
    toggleSelect,
    toggleAll,
    toggleStatus,
    setEditingTodo,
    confirmDelete,
  } = useTodoStore();

  const handleEdit = (todo: Todo) => {
    setEditingTodo({ ...todo });
  };

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-gray-50/10">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/50 text-gray-500 text-sm font-semibold border-b border-gray-100">
            <th className="p-4 w-12 text-center">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                checked={todos.length > 0 && selectedIds.size === todos.length}
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
          {todos.map((t) => {
            return (
              <tr key={t.id} className="group hover:bg-white transition-colors">
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(t.id)}
                    onChange={() => toggleSelect(t.id)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600  cursor-pointer"
                  />
                </td>
                <td className="p-4 font-medium transition-all duration-300">
                  {t.name}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold transition-colors",
                        t.status === "completed"
                          ? "bg-[#00c853] text-white"
                          : "bg-gray-100 text-gray-500",
                      )}
                    >
                      {t.status === "completed" ? "已完成" : "待完成"}
                    </span>
                    <button
                      onClick={() => toggleStatus(t.id)}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-lg transition-all active:scale-90 group/btn relative",
                        t.status === "completed"
                          ? "bg-blue-50 text-blue-600 shadow-sm"
                          : "text-gray-800 hover:bg-gray-100",
                      )}
                    >
                      {t.status === "completed" ? (
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
                        {t.status === "completed" ? "待完成" : "已完成"}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </button>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {t.createdAt}
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {t.updatedAt}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(t)}
                      className="p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-500 rounded-xl transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => confirmDelete(t.id)}
                      className="p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-500 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TodoTable;
