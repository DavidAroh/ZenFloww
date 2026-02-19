import { supabase } from '../lib/supabase';
import { Task, WorkLog, WellnessEntry } from '../types';

// Helper to map DB snake_case to TS camelCase
const mapTaskFromDB = (data: any): Task => ({
  id: data.id,
  title: data.title,
  description: data.description,
  stress: data.stress,
  status: data.status,
  dueDate: data.due_date,
  assignee: data.assignee || 'Unassigned',
});

const mapLogFromDB = (data: any): WorkLog => ({
  id: data.id,
  date: data.date,
  startTime: data.start_time,
  endTime: data.end_time,
  duration: data.duration,
  status: data.status,
});

const mapWellnessFromDB = (data: any): WellnessEntry => ({
  id: data.id,
  timestamp: data.timestamp,
  mood: data.mood,
  energy: data.energy,
  reflection: data.reflection,
});

export const dataService = {
  // --- Tasks ---
  async getTasks(): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapTaskFromDB);
    } catch (error) {
      console.warn('Supabase fetch failed, falling back to local storage:', error);
      const local = localStorage.getItem('zenflow_tasks');
      return local ? JSON.parse(local) : [];
    }
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: task.title,
          description: task.description,
          stress: task.stress,
          status: task.status,
          due_date: task.dueDate,
          assignee: task.assignee
        }])
        .select()
        .single();

      if (error) throw error;
      return mapTaskFromDB(data);
    } catch (error) {
      console.warn('Supabase create failed, saving locally:', error);
      const newTask = { ...task, id: crypto.randomUUID() };
      const local = JSON.parse(localStorage.getItem('zenflow_tasks') || '[]');
      localStorage.setItem('zenflow_tasks', JSON.stringify([newTask, ...local]));
      return newTask as Task;
    }
  },

  async updateTask(task: Task): Promise<Task> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: task.title,
          description: task.description,
          stress: task.stress,
          status: task.status,
          due_date: task.dueDate,
          assignee: task.assignee
        })
        .eq('id', task.id)
        .select()
        .single();

      if (error) throw error;
      return mapTaskFromDB(data);
    } catch (error) {
      console.warn('Supabase update failed, updating locally:', error);
      const local = JSON.parse(localStorage.getItem('zenflow_tasks') || '[]');
      const updated = local.map((t: Task) => t.id === task.id ? task : t);
      localStorage.setItem('zenflow_tasks', JSON.stringify(updated));
      return task;
    }
  },

  // --- Work Logs ---
  async getLogs(): Promise<WorkLog[]> {
    try {
      const { data, error } = await supabase
        .from('work_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapLogFromDB);
    } catch (error) {
      console.warn('Supabase log fetch failed, falling back to local storage:', error);
      const local = localStorage.getItem('zenflow_logs');
      return local ? JSON.parse(local) : [];
    }
  },

  async createLog(log: Omit<WorkLog, 'id'>): Promise<WorkLog> {
    try {
      const { data, error } = await supabase
        .from('work_logs')
        .insert([{
          date: log.date,
          start_time: log.startTime,
          end_time: log.endTime,
          duration: log.duration,
          status: log.status
        }])
        .select()
        .single();

      if (error) throw error;
      return mapLogFromDB(data);
    } catch (error) {
      console.warn('Supabase log create failed, saving locally:', error);
      const newLog = { ...log, id: crypto.randomUUID() };
      const local = JSON.parse(localStorage.getItem('zenflow_logs') || '[]');
      localStorage.setItem('zenflow_logs', JSON.stringify([newLog, ...local]));
      return newLog as WorkLog;
    }
  },

  async updateLog(log: WorkLog): Promise<WorkLog> {
    try {
      const { data, error } = await supabase
        .from('work_logs')
        .update({
          date: log.date,
          start_time: log.startTime,
          end_time: log.endTime,
          duration: log.duration,
          status: log.status
        })
        .eq('id', log.id)
        .select()
        .single();

      if (error) throw error;
      return mapLogFromDB(data);
    } catch (error) {
      console.warn('Supabase log update failed, updating locally:', error);
      const local = JSON.parse(localStorage.getItem('zenflow_logs') || '[]');
      const updated = local.map((l: WorkLog) => l.id === log.id ? log : l);
      localStorage.setItem('zenflow_logs', JSON.stringify(updated));
      return log;
    }
  },

  // --- Wellness ---
  async getWellnessEntries(): Promise<WellnessEntry[]> {
    try {
      const { data, error } = await supabase
        .from('wellness_entries')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapWellnessFromDB);
    } catch (error) {
      console.warn('Supabase wellness fetch failed, falling back to local storage:', error);
      const local = localStorage.getItem('zenflow_wellness');
      return local ? JSON.parse(local) : [];
    }
  },

  async addWellnessEntry(entry: Omit<WellnessEntry, 'id'>): Promise<WellnessEntry> {
    try {
      const { data, error } = await supabase
        .from('wellness_entries')
        .insert([{
          timestamp: entry.timestamp,
          mood: entry.mood,
          energy: entry.energy,
          reflection: entry.reflection
        }])
        .select()
        .single();

      if (error) throw error;
      return mapWellnessFromDB(data);
    } catch (error) {
      console.warn('Supabase wellness create failed, saving locally');
      const newEntry = { ...entry, id: crypto.randomUUID() };
      const local = JSON.parse(localStorage.getItem('zenflow_wellness') || '[]');
      localStorage.setItem('zenflow_wellness', JSON.stringify([newEntry, ...local]));
      return newEntry as WellnessEntry;
    }
  }
};
