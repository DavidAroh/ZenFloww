
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AIInsight } from '../types';

interface DashboardProps {
  insight: AIInsight | null;
  onStartFocus: () => void;
  userName?: string;
}

const chartData = [
  { name: 'Mon', prod: 6, mood: 7 },
  { name: 'Tue', prod: 8, mood: 6 },
  { name: 'Wed', prod: 5, mood: 8 },
  { name: 'Thu', prod: 9, mood: 5 },
  { name: 'Fri', prod: 7, mood: 7 },
  { name: 'Sat', prod: 4, mood: 9 },
  { name: 'Sun', prod: 3, mood: 8 },
];

const Dashboard: React.FC<DashboardProps> = ({ insight, onStartFocus, userName = 'User' }) => {
  return (
    <div className="max-w-[1400px] w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl font-black tracking-tight text-white">Good Morning, {userName}</h2>
          <p className="text-text-secondary text-lg">Here's your wellness report for today.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-dark border border-border-dark hover:bg-border-dark transition-all">
            <span className="material-symbols-outlined text-white">calendar_today</span>
            <span className="text-white text-sm font-bold">Today</span>
          </button>
          <button 
            onClick={onStartFocus}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-background-dark font-black transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined font-bold">play_arrow</span>
            <span>START FOCUS</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-surface-dark border border-border-dark flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-secondary text-xs font-bold uppercase tracking-wider">Burnout Risk</p>
              <h3 className="text-2xl font-bold text-white mt-1">Low Risk</h3>
            </div>
            <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-black">-5% vs last wk</span>
          </div>
          <div className="mt-8 flex flex-col items-center">
             <div className="relative size-32">
                <svg className="size-full" viewBox="0 0 36 36">
                   <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#28392e" strokeWidth="3" />
                   <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#13ec5b" strokeWidth="3" strokeDasharray="12, 100" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">12%</span>
                  <span className="text-[10px] text-text-secondary">Balanced</span>
                </div>
             </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-surface-dark border border-border-dark flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
               <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
               </div>
               <p className="text-text-secondary text-sm font-bold uppercase tracking-wider">Hours Worked</p>
            </div>
            <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-black">+12%</span>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
               <h3 className="text-4xl font-black text-white">5h 20m</h3>
               <span className="text-xs text-text-secondary">/ 8h goal</span>
            </div>
            <div className="w-full bg-border-dark h-2 rounded-full overflow-hidden">
               <div className="bg-blue-500 h-full rounded-full" style={{width: '66%'}}></div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-surface-dark border border-border-dark flex flex-col justify-between">
           <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
               <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <span className="material-symbols-outlined text-[20px]">mood</span>
               </div>
               <p className="text-text-secondary text-sm font-bold uppercase tracking-wider">Current Mood</p>
            </div>
            <span className="px-2 py-1 rounded bg-white/5 text-text-secondary text-[10px] font-black uppercase">Stable</span>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <h3 className="text-4xl font-black text-white">Calm</h3>
            <span className="material-symbols-outlined text-purple-400 text-4xl animate-pulse">self_improvement</span>
          </div>
          <div className="flex gap-1.5 mt-4">
            <span className="h-1.5 flex-1 rounded-full bg-purple-500"></span>
            <span className="h-1.5 flex-1 rounded-full bg-border-dark"></span>
            <span className="h-1.5 flex-1 rounded-full bg-border-dark"></span>
            <span className="h-1.5 flex-1 rounded-full bg-border-dark"></span>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="rounded-2xl bg-surface-dark border border-border-dark p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">Weekly Rhythm</h3>
            <p className="text-sm text-text-secondary">Productivity (Hours) vs Mood Correlation</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-primary"></span>
               <span className="text-xs font-bold text-text-secondary uppercase">Productivity</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-blue-500"></span>
               <span className="text-xs font-bold text-text-secondary uppercase">Mood</span>
            </div>
          </div>
        </div>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#13ec5b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#13ec5b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#28392e" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9db9a6', fontSize: 12}}
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a261e', border: '1px solid #28392e', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="prod" stroke="#13ec5b" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" />
              <Area type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={3} strokeDasharray="5 5" fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-border-dark min-h-[300px] flex">
           <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url(https://picsum.photos/seed/forest/1200/600)`}}></div>
           <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/70 to-transparent"></div>
           <div className="relative z-10 p-8 flex flex-col justify-center gap-6 max-w-xl">
              <div className="flex items-center gap-2 text-primary">
                 <span className="material-symbols-outlined font-bold">psychology</span>
                 <span className="text-sm font-black uppercase tracking-widest">AI DAILY INSIGHT</span>
              </div>
              <h3 className="text-3xl font-black text-white leading-tight">
                 {insight ? insight.content : "Based on your activity patterns, your peak focus window is between 9 AM and 11 AM today."}
              </h3>
              <div className="flex gap-4">
                 <button className="px-6 py-3 bg-primary text-background-dark font-black rounded-xl hover:bg-primary-dark transition-all">
                    VIEW TIPS
                 </button>
                 <button className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-xl hover:bg-white/20 transition-all">
                    DISMISS
                 </button>
              </div>
           </div>
        </div>

        <div className="flex flex-col gap-6">
           <div className="p-6 rounded-2xl bg-surface-dark border border-border-dark">
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Upcoming Breaks</h4>
              <div className="flex flex-col gap-3">
                 <div className="flex items-center gap-3 p-3 rounded-xl bg-background-dark border border-border-dark">
                    <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg">
                       <span className="material-symbols-outlined text-[20px]">coffee</span>
                    </div>
                    <div>
                       <p className="text-white text-sm font-bold">Afternoon Coffee</p>
                       <p className="text-text-secondary text-xs">15:00 - 15:15</p>
                    </div>
                    <span className="ml-auto text-xs font-bold text-text-secondary">In 20m</span>
                 </div>
                 <div className="flex items-center gap-3 p-3 rounded-xl bg-background-dark border border-border-dark">
                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                       <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </div>
                    <div>
                       <p className="text-white text-sm font-bold">Eye Rest</p>
                       <p className="text-text-secondary text-xs">Every 20 mins</p>
                    </div>
                    <button className="ml-auto text-text-secondary hover:text-primary">
                       <span className="material-symbols-outlined">play_circle</span>
                    </button>
                 </div>
              </div>
           </div>

           <div className="flex-1 p-6 rounded-2xl bg-surface-dark border border-border-dark flex flex-col justify-center items-center text-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                 <span className="material-symbols-outlined text-[32px]">sentiment_satisfied</span>
              </div>
              <div>
                <p className="text-white font-black text-xl leading-none">Log your mood</p>
                <p className="text-text-secondary text-sm mt-2 px-4">Help us tailor your schedule to your energy.</p>
              </div>
              <button className="w-full py-3 rounded-xl border border-border-dark hover:bg-border-dark text-white font-bold transition-all">
                 LOG NOW
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
