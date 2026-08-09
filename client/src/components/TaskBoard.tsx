import React, { useState } from 'react';
import { useTasks, useUpdateTask } from '../services/api';
import { Task, TaskStatus, TaskPriority } from '../types';
import { 
  CheckSquare, 
  Plus, 
  User, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  Filter, 
  Search,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const TaskBoard: React.FC = () => {
  const { data: tasks = [], isLoading } = useTasks();
  const updateTaskMutation = useUpdateTask();

  const [filterAssignee, setFilterAssignee] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [taskSearch, setTaskSearch] = useState<string>('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('දිනුක ප්‍රනාන්දු');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('HIGH');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-07-30');

  const columns: Array<{ id: TaskStatus; label: string; color: string; count: number }> = [
    { id: 'TODO', label: 'To Do', color: 'border-gray-200/80 bg-gray-50/80', count: tasks.filter(t => t.status === 'TODO').length },
    { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-slate-300/80 bg-slate-50/80', count: tasks.filter(t => t.status === 'IN_PROGRESS').length },
    { id: 'REVIEW', label: 'In Review', color: 'border-gray-200/80 bg-gray-50/80', count: tasks.filter(t => t.status === 'REVIEW').length },
    { id: 'DONE', label: 'Completed', color: 'border-emerald-200/80 bg-emerald-50/40', count: tasks.filter(t => t.status === 'DONE').length }
  ];

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(taskSearch.toLowerCase()) || (t.description || '').toLowerCase().includes(taskSearch.toLowerCase());
    const matchesAssignee = filterAssignee === 'ALL' || t.assigneeName === filterAssignee;
    const matchesPriority = filterPriority === 'ALL' || t.priority === filterPriority;
    return matchesSearch && matchesAssignee && matchesPriority;
  });

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskMutation.mutate({ id: taskId, updates: { status: newStatus } });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    // Trigger local update or mutation
    updateTaskMutation.mutate({
      id: `task-custom-${Date.now()}`,
      updates: {
        title: newTaskTitle,
        assigneeName: newTaskAssignee,
        priority: newTaskPriority,
        dueDate: newTaskDueDate,
        status: 'TODO'
      }
    });

    setNewTaskTitle('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Board Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-slate-800" />
            Meeting Action Items & Kanban
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Automated tasks extracted directly from meeting discussions and key decisions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl shadow-xs transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={taskSearch}
            onChange={(e) => setTaskSearch(e.target.value)}
            className="w-full bg-gray-100/80 border border-gray-200 rounded-xl py-1.5 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-semibold">Assignee:</span>
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="bg-gray-100/80 border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-medium focus:outline-none"
            >
              <option value="ALL">All Assignees</option>
              <option value="දිනුක ප්‍රනාන්දු">දිනුක ප්‍රනාන්දු</option>
              <option value="ඉලේෂා වික්‍රමසිංහ">ඉලේෂා වික්‍රමසිංහ</option>
              <option value="කසුන් පෙරේරා">කසුන් පෙරේරා</option>
              <option value="මාලක සංජය">මාලක සංජය</option>
              <option value="යසෝධා තිලකරත්න">යසෝධා තිලකරත්න</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-semibold">Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-gray-100/80 border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-medium focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div key={col.id} className={`p-4 rounded-2xl border ${col.color} space-y-4 flex flex-col min-h-[500px]`}>
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">{col.label}</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-gray-200">
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Task Cards Column */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {colTasks.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 italic">No tasks in {col.label}</div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl bg-white border border-gray-200/90 hover:border-gray-300 transition-all space-y-3 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{task.title}</h4>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                          task.priority === 'URGENT'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : task.priority === 'HIGH'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                          {task.description}
                        </p>
                      )}

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                        <span className="font-semibold text-slate-900 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-500" />
                          {task.assigneeName || 'Unassigned'}
                        </span>
                        <span className="font-mono text-slate-400">{task.dueDate}</span>
                      </div>

                      {/* Status Navigation Quick Buttons */}
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                        <span className="text-[9px] text-slate-400 font-medium">Move:</span>
                        <div className="flex space-x-1">
                          {col.id !== 'TODO' && (
                            <button
                              onClick={() => handleStatusChange(task.id, 'TODO')}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-slate-700 hover:bg-gray-200 font-medium"
                            >
                              To Do
                            </button>
                          )}
                          {col.id !== 'IN_PROGRESS' && (
                            <button
                              onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-900 hover:bg-slate-200 font-medium"
                            >
                              In Prog
                            </button>
                          )}
                          {col.id !== 'DONE' && (
                            <button
                              onClick={() => handleStatusChange(task.id, 'DONE')}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold"
                            >
                              Done
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white border border-gray-200 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-slate-700" />
              Create Action Item
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conduct security audit for API"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-gray-100/80 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assignee</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full bg-gray-100/80 border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none"
                  >
                    <option value="දිනුක ප්‍රනාන්දු">දිනුක ප්‍රනාන්දු</option>
                    <option value="ඉලේෂා වික්‍රමසිංහ">ඉලේෂා වික්‍රමසිංහ</option>
                    <option value="කසුන් පෙරේරා">කසුන් පෙරේරා</option>
                    <option value="මාලක සංජය">මාලක සංජය</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="w-full bg-gray-100/80 border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full bg-gray-100/80 border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-slate-700 text-xs font-semibold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-2xs"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
