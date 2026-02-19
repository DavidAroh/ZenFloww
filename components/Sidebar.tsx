
import React, { useState } from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onLogout?: () => void;
  userEmail?: string;
  userName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  isMobileOpen = false, 
  onCloseMobile, 
  onLogout,
  userEmail,
  userName = 'User'
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: AppView.DASHBOARD, icon: 'dashboard', label: 'Dashboard' },
    { id: AppView.TASKS, icon: 'view_kanban', label: 'Tasks' },
    { id: AppView.WELLNESS, icon: 'favorite', label: 'Wellness' },
    { id: AppView.LOGS, icon: 'schedule', label: 'Work Log' },
    { id: AppView.FOCUS, icon: 'timer', label: 'Focus Timer' },
    { id: AppView.SETTINGS, icon: 'settings', label: 'Settings' },
  ];

  const handleNavClick = (view: AppView) => {
    onViewChange(view);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col border-r border-border-dark bg-background-dark transition-all duration-300
          ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
          ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-8">
            <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'} px-2 pt-2`}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-xl bg-primary/20 text-primary shrink-0">
                  <span className="material-symbols-outlined text-2xl">spa</span>
                </div>
                {(!isCollapsed || isMobileOpen) && (
                  <div className="flex flex-col overflow-hidden">
                    <h1 className="text-white text-lg font-bold leading-none tracking-tight truncate">ZenFlow</h1>
                    <p className="text-text-secondary text-xs font-medium uppercase tracking-widest truncate">Wellness & Flow</p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:block text-text-secondary hover:text-white transition-colors p-1 rounded-lg hover:bg-surface-dark"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <span className="material-symbols-outlined">
                  {isCollapsed ? 'chevron_right' : 'chevron_left'}
                </span>
              </button>
              
              <button 
                onClick={onCloseMobile}
                className="lg:hidden text-text-secondary hover:text-white transition-colors p-1 rounded-lg hover:bg-surface-dark"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center px-2' : 'px-4'} py-3 rounded-xl transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:bg-surface-dark hover:text-white'
                  }`}
                  title={isCollapsed && !isMobileOpen ? item.label : undefined}
                >
                  <span className={`material-symbols-outlined text-[24px]`}>{item.icon}</span>
                  {(!isCollapsed || isMobileOpen) && <span className="text-sm font-semibold whitespace-nowrap ml-3">{item.label}</span>}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto">
            {userEmail && (
              <div className={`flex items-center gap-3 ${(isCollapsed && !isMobileOpen) ? 'justify-center p-2' : 'p-3'} rounded-2xl border border-white/10 bg-white/5`}>
                <div className="size-10 rounded-full bg-cover bg-center shrink-0 bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg">
                   {userName.charAt(0).toUpperCase()}
                </div>
                {(!isCollapsed || isMobileOpen) && (
                  <>
                    <div className="flex flex-col overflow-hidden flex-1 min-w-0 text-left">
                      <p className="text-white text-sm font-bold truncate">{userName}</p>
                      <p className="text-text-secondary text-xs truncate">{userEmail}</p>
                    </div>
                    {onLogout && (
                      <button
                        onClick={onLogout}
                        className="text-text-secondary hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                        title="Logout"
                      >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
