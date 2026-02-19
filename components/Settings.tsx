import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Settings: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [focusDuration, setFocusDuration] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        setName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
      }
      
      // Load other settings from local storage
      const savedSettings = localStorage.getItem('zenflow_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setNotifications(parsed.notifications ?? true);
        setFocusDuration(parsed.focusDuration ?? 25);
        setShortBreak(parsed.shortBreak ?? 5);
        setLongBreak(parsed.longBreak ?? 15);
        setAutoStartBreaks(parsed.autoStartBreaks ?? false);
      }
    };
    getUser();
  }, []);

  const handleSave = async () => {
    try {
      // Update Supabase profile
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name }
      });

      if (error) throw error;

      // Save local settings
      const settings = {
        notifications,
        focusDuration,
        shortBreak,
        longBreak,
        autoStartBreaks
      };
      localStorage.setItem('zenflow_settings', JSON.stringify(settings));

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      <h2 className="text-3xl font-black text-white mb-2">Settings</h2>
      <p className="text-text-secondary mb-8">Manage your preferences and account settings.</p>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-surface-dark border border-border-dark rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span>
            Profile Information
          </h3>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-3">
              <div className="size-24 rounded-full bg-cover bg-center border-2 border-primary" style={{ backgroundImage: `url(https://picsum.photos/seed/user/100)` }}></div>
              <button className="text-sm text-primary font-bold hover:text-primary-dark transition-colors">
                Change Avatar
              </button>
            </div>
            
            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-text-secondary font-semibold">Display Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-text-secondary font-semibold">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="pt-2">
                 <p className="text-xs text-text-secondary">Avatar provided by Lorem Picsum.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Focus Timer Settings */}
        <section className="bg-surface-dark border border-border-dark rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">timer</span>
            Focus Timer Configuration
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-text-secondary font-semibold">Focus Duration (min)</label>
              <input 
                type="number" 
                value={focusDuration}
                onChange={(e) => setFocusDuration(parseInt(e.target.value) || 0)}
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-text-secondary font-semibold">Short Break (min)</label>
              <input 
                type="number" 
                value={shortBreak}
                onChange={(e) => setShortBreak(parseInt(e.target.value) || 0)}
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-text-secondary font-semibold">Long Break (min)</label>
              <input 
                type="number" 
                value={longBreak}
                onChange={(e) => setLongBreak(parseInt(e.target.value) || 0)}
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between p-4 bg-background-dark rounded-lg border border-border-dark">
             <div>
               <h4 className="text-white font-bold">Auto-start Breaks</h4>
               <p className="text-xs text-text-secondary">Automatically start break timer when focus session ends</p>
             </div>
             <button 
               onClick={() => setAutoStartBreaks(!autoStartBreaks)}
               className={`w-12 h-6 rounded-full p-1 transition-colors ${autoStartBreaks ? 'bg-primary' : 'bg-gray-600'}`}
             >
               <div className={`size-4 rounded-full bg-white shadow-sm transition-transform ${autoStartBreaks ? 'translate-x-6' : 'translate-x-0'}`}></div>
             </button>
          </div>
        </section>

        {/* Notifications & App Settings */}
        <section className="bg-surface-dark border border-border-dark rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">notifications</span>
            Notifications & Application
          </h3>
          
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-background-dark rounded-lg border border-border-dark">
               <div>
                 <h4 className="text-white font-bold">Enable Notifications</h4>
                 <p className="text-xs text-text-secondary">Receive alerts for completed tasks and wellness reminders</p>
               </div>
               <button 
                 onClick={() => setNotifications(!notifications)}
                 className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications ? 'bg-primary' : 'bg-gray-600'}`}
               >
                 <div className={`size-4 rounded-full bg-white shadow-sm transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
               </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-background-dark rounded-lg border border-border-dark">
               <div>
                 <h4 className="text-white font-bold">Theme</h4>
                 <p className="text-xs text-text-secondary">Currently locked to Zen Dark Mode</p>
               </div>
               <span className="px-3 py-1 bg-surface-dark border border-border-dark rounded-lg text-xs font-mono text-primary">
                 DARK
               </span>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="border border-red-900/50 bg-red-900/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-red-400 mb-2">Danger Zone</h3>
          <p className="text-sm text-text-secondary mb-6">Irreversible actions for your account and data.</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-4 py-2 bg-transparent border border-red-500/50 text-red-400 font-bold rounded-lg hover:bg-red-900/20 transition-colors">
              Clear All Data
            </button>
            <button className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </section>
        
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            className="px-6 py-3 bg-primary text-background-dark font-black rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;