import React, { useState } from 'react';
import { Task, StressLevel } from '../types';

interface CreateTaskModalProps {
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  initialStatus?: Task['status'];
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose, onSave, initialStatus = 'todo' }) => {
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    stress: StressLevel.MEDIUM,
    status: initialStatus,
    dueDate: '',
    assignee: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = () => {
    if (!newTask.title.trim()) return;
    onSave(newTask);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl bg-surface-dark border border-border-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-border-dark flex items-center justify-between bg-surface-darker">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">add_task</span>
            <h3 className="text-xl font-black text-white tracking-tight">Create New Task</h3>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Title</label>
            <input 
              name="title"
              value={newTask.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className="bg-background-dark border-border-dark rounded-xl text-white font-bold focus:ring-primary focus:border-primary transition-all p-3"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Stress Level</label>
              <select 
                name="stress"
                value={newTask.stress}
                onChange={handleChange}
                className="bg-background-dark border-border-dark rounded-xl text-white focus:ring-primary focus:border-primary transition-all p-3"
              >
                <option value={StressLevel.LOW}>{StressLevel.LOW}</option>
                <option value={StressLevel.MEDIUM}>{StressLevel.MEDIUM}</option>
                <option value={StressLevel.HIGH}>{StressLevel.HIGH}</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Status</label>
              <select 
                name="status"
                value={newTask.status}
                onChange={handleChange}
                className="bg-background-dark border-border-dark rounded-xl text-white focus:ring-primary focus:border-primary transition-all p-3"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Assignee</label>
              <div className="relative">
                <input 
                  name="assignee"
                  value={newTask.assignee}
                  onChange={handleChange}
                  placeholder="e.g. Me"
                  className="w-full bg-background-dark border-border-dark rounded-xl text-white focus:ring-primary focus:border-primary transition-all p-3 pl-10"
                />
                <span className="material-symbols-outlined absolute left-3 top-3.5 text-text-secondary text-[18px]">person</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Due Date</label>
              <div className="relative">
                <input 
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleChange}
                  placeholder="e.g. Oct 24 or Today"
                  className="w-full bg-background-dark border-border-dark rounded-xl text-white focus:ring-primary focus:border-primary transition-all p-3 pl-10"
                />
                <span className="material-symbols-outlined absolute left-3 top-3.5 text-text-secondary text-[18px]">calendar_today</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Description</label>
            <textarea 
              name="description"
              rows={4}
              value={newTask.description}
              onChange={handleChange}
              className="bg-background-dark border-border-dark rounded-xl text-white text-sm focus:ring-primary focus:border-primary transition-all p-3 resize-none"
              placeholder="Detail the work to be done..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-dark flex items-center justify-end gap-3 bg-surface-darker">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-text-secondary font-bold hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-primary text-background-dark font-black rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
