
import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { AppView, Task, WellnessEntry, WorkLog, AIInsight } from './types';
import { INITIAL_TASKS, INITIAL_LOGS } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FocusTimer from './components/FocusTimer';
import TaskBoard from './components/TaskBoard';
import TaskDetailModal from './components/TaskDetailModal';
import Settings from './components/Settings';
import { Auth } from './components/Auth';
import { gemini } from './services/geminiService';
import { dataService } from './services/dataService';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [wellness, setWellness] = useState<WellnessEntry[]>([]);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<Task['status']>('todo');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Auth & Initial Data Fetch
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session) await loadData();
        else setIsLoading(false);
      } catch (err) {
        console.error("Initialization error:", err);
        setLoadingError("Failed to initialize application.");
        setIsLoading(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadData();
      else {
        setTasks([]);
        setLogs([]);
        setWellness([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Safety timeout for very slow/failed initialization
  useEffect(() => {
    if (!isLoading || loadingError) return;

    const timeout = setTimeout(() => {
      setLoadingError("Loading is taking longer than expected. Please check your connection.");
      setIsLoading(false);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [isLoading, loadingError]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [fetchedTasks, fetchedLogs, fetchedWellness] = await Promise.all([
        dataService.getTasks(),
        dataService.getLogs(),
        dataService.getWellnessEntries()
      ]);
      
      setTasks(fetchedTasks);
      setLogs(fetchedLogs);
      setWellness(fetchedWellness);
    } catch (error) {
      console.error("Failed to load data from Supabase:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchInsight = async () => {
      if (!isLoading && session) {
        const insight = await gemini.generateDailyInsight(tasks, wellness, logs);
        setAiInsight(insight);
      }
    };
    fetchInsight();
  }, [tasks, wellness, logs, isLoading, session]);

  const handleUpdateTask = async (updatedTask: Task) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setSelectedTask(null);

    try {
      await dataService.updateTask(updatedTask);
    } catch (error) {
      console.error("Failed to update task in Supabase:", error);
      // Revert if needed, but for now we just log
    }
  };

  const handleCreateTask = async (newTask: Omit<Task, 'id'>) => {
    setIsCreatingTask(false);
    try {
      const createdTask = await dataService.createTask(newTask);
      setTasks(prev => [createdTask, ...prev]);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleAddWellness = async (entry: Omit<WellnessEntry, 'id'>) => {
    try {
      const newEntry = await dataService.addWellnessEntry(entry);
      setWellness(prev => [newEntry, ...prev]);
    } catch (error) {
      console.error("Failed to add wellness entry:", error);
      throw error;
    }
  };

  const handleSessionComplete = async (duration: number) => {
    const now = new Date();
    const startTime = new Date(now.getTime() - duration * 1000);
    
    const newLog: Omit<WorkLog, 'id'> = {
      date: now.toISOString().split('T')[0],
      startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: `${Math.floor(duration / 60)}m`,
      status: 'completed'
    };

    try {
      const savedLog = await dataService.createLog(newLog);
      setLogs(prev => [savedLog, ...prev]);
    } catch (error) {
      console.error("Failed to save log:", error);
      // Fallback: add to local state with temp ID so user sees it
      const tempLog = { ...newLog, id: crypto.randomUUID() };
      setLogs(prev => [tempLog, ...prev]);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-background-dark text-white items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-text-secondary animate-pulse">Loading ZenFlow...</p>
        </div>
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="flex h-screen w-full bg-background-dark text-white items-center justify-center p-4">
        <div className="bg-surface-dark border border-red-500/30 p-8 rounded-2xl max-w-md w-full text-center">
          <span className="material-symbols-outlined text-4xl text-red-500 mb-4">error</span>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-text-secondary mb-6">{loadingError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-background-dark font-bold rounded-lg hover:bg-primary-dark transition-colors"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <Dashboard 
            insight={aiInsight} 
            onStartFocus={() => setCurrentView(AppView.FOCUS)}
            userName={session.user.email?.split('@')[0] || 'User'}
          />
        );
      case AppView.FOCUS:
        return <FocusTimer onSessionComplete={handleSessionComplete} />;
      case AppView.TASKS:
        return (
          <div className="p-4 md:p-8 h-full overflow-hidden flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-black text-white">Project Tasks</h2>
                <p className="text-text-secondary">Manage your workflow and track stressors.</p>
              </div>
              <button 
                onClick={() => {
                  setNewTaskStatus('todo');
                  setIsCreatingTask(true);
                }}
                className="bg-primary text-background-dark px-4 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors w-full md:w-auto"
              >
                + New Task
              </button>
            </div>
            <TaskBoard 
              tasks={tasks} 
              onSelectTask={setSelectedTask} 
              onAddTask={(status) => {
                setNewTaskStatus(status);
                setIsCreatingTask(true);
              }}
            />
          </div>
        );
      case AppView.LOGS:
        return (
          <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-black mb-8">Work History</h2>
            <div className="space-y-4">
              {logs.map(log => (
                <div key={log.id} className="p-6 bg-surface-dark border border-border-dark rounded-xl flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white">{log.date}</h3>
                    <p className="text-text-secondary text-sm">{log.startTime} - {log.endTime || 'Active'}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black uppercase ${log.status === 'overworked' ? 'text-red-400' : 'text-primary'}`}>
                      {log.status}
                    </p>
                    <p className="text-white font-mono">{log.duration || '--'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case AppView.WELLNESS:
        return <div className="p-8">Wellness module coming soon...</div>;
      case AppView.SETTINGS:
        return <Settings />;
      default:
        return <div className="p-8">Module coming soon...</div>;
    }
  };

  return (
    <div className="flex h-screen w-full bg-background-dark text-white overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
        userEmail={session.user.email}
        userName={session.user.user_metadata?.full_name || session.user.email?.split('@')[0]}
      />
      <main className="flex-1 overflow-y-auto scroll-smooth relative">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden absolute top-4 left-4 z-30 p-2 bg-surface-dark/50 border border-border-dark rounded-lg text-white hover:bg-surface-dark transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        {renderView()}
      </main>

      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onSave={handleUpdateTask}
        />
      )}

      {isCreatingTask && (
        <TaskDetailModal
          onClose={() => setIsCreatingTask(false)}
          onSave={handleCreateTask}
          initialStatus={newTaskStatus}
        />
      )}
    </div>
  );
};

export default App;
