
import React from 'react';
import { Task, StressLevel } from '../types';

interface TaskBoardProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onAddTask: (status: Task['status']) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onSelectTask, onAddTask }) => {
  const columns: { title: string; status: Task['status'] }[] = [
    { title: 'Backlog', status: 'backlog' },
    { title: 'To Do', status: 'todo' },
    { title: 'In Progress', status: 'in-progress' },
    { title: 'Done', status: 'done' }
  ];

  const getStressColor = (stress: StressLevel) => {
    switch (stress) {
      case StressLevel.LOW: return 'text-primary bg-primary/10';
      case StressLevel.MEDIUM: return 'text-orange-400 bg-orange-400/10';
      case StressLevel.HIGH: return 'text-red-400 bg-red-400/10';
      default: return 'text-text-secondary bg-white/5';
    }
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
      <div className="flex gap-6 h-full min-w-[1000px]">
        {columns.map(col => (
          <div key={col.status} className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-text-secondary">
                {col.title}
                <span className="ml-2 px-1.5 py-0.5 rounded-md bg-border-dark text-[10px]">
                  {tasks.filter(t => t.status === col.status).length}
                </span>
              </h3>
              <button className="text-text-secondary hover:text-white">
                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
              </button>
            </div>
            
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
              {tasks.filter(t => t.status === col.status).map(task => (
                <div 
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="p-4 rounded-xl bg-surface-dark border border-border-dark hover:border-primary/50 transition-all cursor-pointer group shadow-sm hover:shadow-primary/5"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider ${getStressColor(task.stress)}`}>
                        {task.stress}
                      </span>
                      <span className="text-[10px] text-text-secondary font-bold">{task.dueDate}</span>
                    </div>
                    
                    <h4 className="text-white font-bold group-hover:text-primary transition-colors leading-tight">
                      {task.title}
                    </h4>
                    
                    <p className="text-text-secondary text-xs line-clamp-2">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between mt-1">
                      <div className="flex -space-x-2">
                         <div className="size-6 rounded-full border-2 border-surface-dark bg-cover" style={{backgroundImage: `url(https://picsum.photos/seed/${task.assignee}/50)`}}></div>
                      </div>
                      <div className="flex items-center gap-2 text-text-secondary">
                        <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                        <span className="text-[10px] font-bold">2</span>
                        <span className="material-symbols-outlined text-[16px]">attachment</span>
                        <span className="text-[10px] font-bold">1</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => onAddTask(col.status)}
                className="w-full py-2 border border-dashed border-border-dark rounded-xl text-text-secondary hover:text-primary hover:border-primary/30 transition-all text-xs font-bold"
              >
                + Add Card
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
