'use client';

import { useState } from 'react';

type TaskStatus = 'Pending' | 'Running' | 'Completed';

interface SubTask {
  id: string;
  title: string;
  status: TaskStatus;
}

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  subtasks: SubTask[];
  isExpanded: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [addingSubtaskToTaskId, setAddingSubtaskToTaskId] = useState<string | null>(null);

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        status: 'Pending',
        subtasks: [],
        isExpanded: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const saveTaskEdit = (taskId: string) => {
    if (editingTitle.trim()) {
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, title: editingTitle } : task
      ));
    }
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const cancelTaskEdit = () => {
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const toggleTaskExpanded = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isExpanded: !task.isExpanded } : task
    ));
  };

  const addSubtask = (taskId: string) => {
    if (newSubtaskTitle.trim()) {
      const newSubtask: SubTask = {
        id: Date.now().toString(),
        title: newSubtaskTitle,
        status: 'Pending',
      };
      setTasks(tasks.map(task =>
        task.id === taskId
          ? { ...task, subtasks: [...task.subtasks, newSubtask] }
          : task
      ));
      setNewSubtaskTitle('');
      setAddingSubtaskToTaskId(null);
    }
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, subtasks: task.subtasks.filter(st => st.id !== subtaskId) }
        : task
    ));
  };

  const updateSubtaskStatus = (taskId: string, subtaskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map(st =>
              st.id === subtaskId ? { ...st, status } : st
            )
          }
        : task
    ));
  };

  const startEditingSubtask = (subtask: SubTask) => {
    setEditingSubtaskId(subtask.id);
    setEditingSubtaskTitle(subtask.title);
  };

  const saveSubtaskEdit = (taskId: string, subtaskId: string) => {
    if (editingSubtaskTitle.trim()) {
      setTasks(tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map(st =>
                st.id === subtaskId ? { ...st, title: editingSubtaskTitle } : st
              )
            }
          : task
      ));
    }
    setEditingSubtaskId(null);
    setEditingSubtaskTitle('');
  };

  const cancelSubtaskEdit = () => {
    setEditingSubtaskId(null);
    setEditingSubtaskTitle('');
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-slate-800 text-yellow-400 border border-yellow-400 shadow-[0_0_10px_rgba(255,255,0,0.5)]';
      case 'Running':
        return 'bg-slate-800 text-cyan-400 border border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.5)] animate-glow-pulse';
      case 'Completed':
        return 'bg-slate-800 text-green-400 border border-green-400 shadow-[0_0_10px_rgba(0,255,128,0.5)]';
    }
  };

  return (
    <div className="min-h-screen cyber-grid py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-cyan-400 mb-8 text-center animate-neon-pulse tracking-wider">
          TODO管理アプリ
        </h1>

        {/* Add Task Form */}
        <div className="glass-morph rounded-2xl p-6 mb-6 animate-slide-in">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="新しいタスクを入力..."
              className="flex-1 px-4 py-3 bg-slate-900 border-2 border-cyan-400/50 rounded-lg focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] text-cyan-100 placeholder-cyan-600 transition-all"
            />
            <button
              onClick={addTask}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white rounded-lg hover:shadow-[0_0_20px_rgba(0,255,255,0.8)] transition-all font-bold tracking-wide animate-float"
            >
              追加
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="glass-morph rounded-2xl overflow-hidden animate-slide-up hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all">
              <div className="p-4 border-b border-cyan-400/30">
                <div className="flex items-center gap-3">
                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => toggleTaskExpanded(task.id)}
                    className="text-cyan-400 hover:text-magenta-400 hover:shadow-[0_0_10px_rgba(255,0,255,0.8)] transition-all"
                  >
                    <svg
                      className={`w-5 h-5 transition-transform ${task.isExpanded ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Task Title */}
                  <div className="flex-1">
                    {editingTaskId === task.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') saveTaskEdit(task.id);
                            if (e.key === 'Escape') cancelTaskEdit();
                          }}
                          className="flex-1 px-3 py-1 bg-slate-900 border-2 border-cyan-400 rounded focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] text-cyan-100"
                          autoFocus
                        />
                        <button
                          onClick={() => saveTaskEdit(task.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:shadow-[0_0_15px_rgba(0,255,128,0.8)] text-sm border border-green-400 transition-all"
                        >
                          保存
                        </button>
                        <button
                          onClick={cancelTaskEdit}
                          className="px-3 py-1 bg-slate-700 text-cyan-100 rounded hover:shadow-[0_0_15px_rgba(100,100,100,0.8)] text-sm border border-slate-500 transition-all"
                        >
                          キャンセル
                        </button>
                      </div>
                    ) : (
                      <h3 className="text-lg font-semibold text-cyan-100 animate-flicker">{task.title}</h3>
                    )}
                  </div>

                  {/* Status Badges */}
                  <div className="flex gap-1">
                    {(['Pending', 'Running', 'Completed'] as TaskStatus[]).map(status => (
                      <button
                        key={status}
                        onClick={() => updateTaskStatus(task.id, status)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          task.status === status
                            ? getStatusColor(status)
                            : 'bg-slate-800 text-slate-500 border border-slate-600 hover:border-cyan-400 hover:text-cyan-400'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  {editingTaskId !== task.id && (
                    <>
                      <button
                        onClick={() => startEditingTask(task)}
                        className="px-3 py-1 text-cyan-400 hover:text-cyan-200 hover:shadow-[0_0_10px_rgba(0,255,255,0.6)] rounded transition-all border border-cyan-400/50"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="px-3 py-1 text-magenta-400 hover:text-magenta-200 hover:shadow-[0_0_10px_rgba(255,0,255,0.6)] rounded transition-all border border-magenta-400/50"
                      >
                        削除
                      </button>
                    </>
                  )}
                </div>

                {/* Subtask Count */}
                {task.subtasks.length > 0 && (
                  <div className="mt-2 text-sm text-cyan-300">
                    サブタスク: <span className="text-magenta-400 font-bold">{task.subtasks.filter(st => st.status === 'Completed').length}</span> / {task.subtasks.length}
                  </div>
                )}
              </div>

              {/* Subtasks Section */}
              {task.isExpanded && (
                <div className="p-4 bg-slate-900/50">
                  <div className="space-y-2">
                    {task.subtasks.map(subtask => (
                      <div key={subtask.id} className="bg-slate-800/60 rounded-xl p-3 flex items-center gap-3 border border-cyan-400/20 hover:border-cyan-400/50 transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                        <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-magenta-400 rounded-full shadow-[0_0_10px_rgba(0,255,255,0.8)]"></div>

                        {/* Subtask Title */}
                        <div className="flex-1">
                          {editingSubtaskId === subtask.id ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editingSubtaskTitle}
                                onChange={(e) => setEditingSubtaskTitle(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') saveSubtaskEdit(task.id, subtask.id);
                                  if (e.key === 'Escape') cancelSubtaskEdit();
                                }}
                                className="flex-1 px-2 py-1 bg-slate-900 border-2 border-cyan-400 rounded focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.5)] text-cyan-100"
                                autoFocus
                              />
                              <button
                                onClick={() => saveSubtaskEdit(task.id, subtask.id)}
                                className="px-2 py-1 bg-green-500 text-white rounded hover:shadow-[0_0_10px_rgba(0,255,128,0.8)] text-xs border border-green-400 transition-all"
                              >
                                保存
                              </button>
                              <button
                                onClick={cancelSubtaskEdit}
                                className="px-2 py-1 bg-slate-700 text-cyan-100 rounded hover:shadow-[0_0_10px_rgba(100,100,100,0.8)] text-xs border border-slate-500 transition-all"
                              >
                                キャンセル
                              </button>
                            </div>
                          ) : (
                            <span className="text-cyan-200">{subtask.title}</span>
                          )}
                        </div>

                        {/* Subtask Status Badges */}
                        <div className="flex gap-1">
                          {(['Pending', 'Running', 'Completed'] as TaskStatus[]).map(status => (
                            <button
                              key={status}
                              onClick={() => updateSubtaskStatus(task.id, subtask.id, status)}
                              className={`px-2 py-1 rounded-full text-xs font-bold transition-all ${
                                subtask.status === status
                                  ? getStatusColor(status)
                                  : 'bg-slate-900 text-slate-500 border border-slate-700 hover:border-cyan-400 hover:text-cyan-400'
                              }`}
                            >
                              {status.charAt(0)}
                            </button>
                          ))}
                        </div>

                        {/* Subtask Action Buttons */}
                        {editingSubtaskId !== subtask.id && (
                          <>
                            <button
                              onClick={() => startEditingSubtask(subtask)}
                              className="px-2 py-1 text-cyan-400 hover:shadow-[0_0_8px_rgba(0,255,255,0.6)] rounded text-sm border border-cyan-400/50 transition-all"
                            >
                              編集
                            </button>
                            <button
                              onClick={() => deleteSubtask(task.id, subtask.id)}
                              className="px-2 py-1 text-magenta-400 hover:shadow-[0_0_8px_rgba(255,0,255,0.6)] rounded text-sm border border-magenta-400/50 transition-all"
                            >
                              削除
                            </button>
                          </>
                        )}
                      </div>
                    ))}

                    {/* Add Subtask Form */}
                    {addingSubtaskToTaskId === task.id ? (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={newSubtaskTitle}
                          onChange={(e) => setNewSubtaskTitle(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') addSubtask(task.id);
                            if (e.key === 'Escape') {
                              setAddingSubtaskToTaskId(null);
                              setNewSubtaskTitle('');
                            }
                          }}
                          placeholder="サブタスクを入力..."
                          className="flex-1 px-3 py-2 bg-slate-900 border-2 border-cyan-400 rounded focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] text-cyan-100 placeholder-cyan-600"
                          autoFocus
                        />
                        <button
                          onClick={() => addSubtask(task.id)}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white rounded hover:shadow-[0_0_15px_rgba(0,255,255,0.8)] text-sm font-bold transition-all"
                        >
                          追加
                        </button>
                        <button
                          onClick={() => {
                            setAddingSubtaskToTaskId(null);
                            setNewSubtaskTitle('');
                          }}
                          className="px-4 py-2 bg-slate-700 text-cyan-100 rounded hover:shadow-[0_0_10px_rgba(100,100,100,0.8)] text-sm border border-slate-500 transition-all"
                        >
                          キャンセル
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingSubtaskToTaskId(task.id)}
                        className="w-full mt-2 px-4 py-2 border-2 border-dashed border-cyan-400/50 rounded text-cyan-400 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all font-bold"
                      >
                        + サブタスクを追加
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-12 glass-morph rounded-2xl animate-pulse">
            <p className="text-cyan-400 text-2xl font-bold mb-2 animate-neon-pulse">タスクがありません</p>
            <p className="text-cyan-300 text-sm mt-2">上のフォームから新しいタスクを追加してください</p>
          </div>
        )}
      </div>
    </div>
  );
}
