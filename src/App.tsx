import "./App.css";
import { useTodoStore } from "./stores/useTodoStore";
import  TodoForm  from "./components/TodoForm";
import  TodoStats  from "./components/TodoStats";
import  TodoTable  from "./components/TodoTable";
import  Modal  from "./components/Modal";
import { Trash2 } from "lucide-react";

function App() {
  const {
    editingTodo,
    isDeleteModalOpen,
    setEditingTodo,
    saveEdit,
    handleDelete,
    closeDeleteModal,
  } = useTodoStore();

  return (
    <div className="min-h-screen bg-[#eef2f7] w-full flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow border border-white/50">
        <div className="p-8">
          <h1 className="text-4xl text-center font-extrabold mb-10 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            待办事项清单
          </h1>
          <TodoForm />
          <TodoStats />
          <TodoTable />
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
               editingTodo && setEditingTodo({ ...editingTodo, name: e.target.value })
                
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
        onClose={closeDeleteModal}
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
              onClick={closeDeleteModal}
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

export default App;
