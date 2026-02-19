import React, { useState } from 'react';
import { WellnessEntry } from '../types';

interface WellnessProps {
  entries: WellnessEntry[];
  onAddEntry: (entry: Omit<WellnessEntry, 'id'>) => Promise<void>;
}

const Wellness: React.FC<WellnessProps> = ({ entries, onAddEntry }) => {
  const [mood, setMood] = useState<'great' | 'good' | 'neutral' | 'tired' | 'stressed'>('good');
  const [energy, setEnergy] = useState<number>(5);
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAddEntry({
        timestamp: new Date().toISOString(),
        mood,
        energy,
        reflection
      });
      setReflection('');
      setEnergy(5);
    } catch (error) {
      console.error("Failed to add wellness entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodIcon = (m: string) => {
    switch (m) {
      case 'great': return 'sentiment_very_satisfied';
      case 'good': return 'sentiment_satisfied';
      case 'neutral': return 'sentiment_neutral';
      case 'tired': return 'bedtime';
      case 'stressed': return 'sentiment_very_dissatisfied';
      default: return 'sentiment_neutral';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-full overflow-y-auto">
      <h2 className="text-3xl font-black text-white mb-2">Wellness Hub</h2>
      <p className="text-text-secondary mb-8">Track your energy and mood to optimize your flow state.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Entry Form */}
        <div className="lg:col-span-1">
          <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 sticky top-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">edit_note</span>
              Daily Check-in
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Current Mood</label>
                <div className="grid grid-cols-5 gap-2">
                  {['great', 'good', 'neutral', 'tired', 'stressed'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m as any)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                        mood === m 
                          ? 'bg-primary text-background-dark ring-2 ring-primary ring-offset-2 ring-offset-surface-dark' 
                          : 'bg-background-dark text-text-secondary hover:bg-white/5 hover:text-white'
                      }`}
                      title={m.charAt(0).toUpperCase() + m.slice(1)}
                    >
                      <span className="material-symbols-outlined text-2xl mb-1">{getMoodIcon(m)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Energy Level</label>
                  <span className="text-primary font-mono font-bold">{energy}/10</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={energy}
                  onChange={(e) => setEnergy(parseInt(e.target.value))}
                  className="w-full accent-primary h-2 bg-background-dark rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-text-secondary font-medium">
                  <span>Drained</span>
                  <span>Peak Flow</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Quick Reflection</label>
                <textarea 
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="How are you feeling right now?"
                  rows={4}
                  className="w-full bg-background-dark border border-border-dark rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3 bg-primary text-background-dark font-black rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="animate-spin material-symbols-outlined">refresh</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">check_circle</span>
                    Log Entry
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* History List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            Recent Entries
          </h3>

          <div className="grid gap-4">
            {entries.length === 0 ? (
              <div className="text-center p-12 bg-surface-dark border border-border-dark rounded-2xl border-dashed">
                <span className="material-symbols-outlined text-4xl text-text-secondary mb-2">spa</span>
                <p className="text-text-secondary">No wellness entries yet. Start tracking your flow!</p>
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="bg-surface-dark border border-border-dark rounded-2xl p-5 hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-full flex items-center justify-center ${
                        entry.mood === 'great' || entry.mood === 'good' ? 'bg-green-500/20 text-green-400' :
                        entry.mood === 'neutral' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        <span className="material-symbols-outlined">{getMoodIcon(entry.mood)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold capitalize">{entry.mood}</span>
                          <span className="text-text-secondary text-sm">•</span>
                          <span className="text-primary font-mono text-sm">Energy: {entry.energy}/10</span>
                        </div>
                        <p className="text-xs text-text-secondary">
                          {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  </div>
                  {entry.reflection && (
                    <p className="text-gray-300 text-sm leading-relaxed pl-[52px]">
                      "{entry.reflection}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wellness;
