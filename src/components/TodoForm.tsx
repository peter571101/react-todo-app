import { Plus } from "lucide-react";
import { useTodoStore } from "../stores/useTodoStore";

const TodoForm = () => {
  const { inputValue, setInputValue, addTodo } = useTodoStore();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    addTodo(inputValue);
  };

  return (
    <form onSubmit={handleAdd} className="flex gap-4 mb-8">
      <div className="flex-1 relative group">
        <input
          type="text"
          placeholder="添加待办事项..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          className="w-full h-14 pl-6 pr-12 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-gray-700"
        />
      </div>
      <button
        type="submit"
        className="h-14 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/40"
      >
        <Plus size={20} />
      </button>
    </form>
  );
};

export default TodoForm;