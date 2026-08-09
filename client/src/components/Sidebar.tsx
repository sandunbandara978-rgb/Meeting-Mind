import React from 'react';
import { useMeetingStore } from '../store/useMeetingStore';
import { useAuthStore } from '../store/useAuthStore';
import { ActiveTab } from '../types';
import { 
  LayoutDashboard, 
  Mic, 
  Video, 
  CheckSquare, 
  BarChart3, 
  Bot, 
  Sparkles,
  Calendar,
  ShieldAlert
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useMeetingStore();
  const { user } = useAuthStore();

  const navItems: Array<{ id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: string; requireRole?: string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'studio', label: 'Live Studio', icon: Mic, badge: 'Live' },
    { id: 'meetings', label: 'Meetings Library', icon: Video },
    { id: 'tasks', label: 'Tasks & Actions', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'assistant', label: 'AI Q&A Assistant', icon: Bot, badge: 'AI' },
    { id: 'admin', label: 'Admin Console', icon: ShieldAlert, badge: 'Admin', requireRole: 'ADMIN' }
  ];

  // Filter nav items based on role
  const visibleItems = navItems.filter((item) => {
    if (item.requireRole && user?.role !== item.requireRole) return false;
    return true;
  });

  return (
    <aside className="w-64 sidebar-bg flex flex-col justify-between p-4 shrink-0 hidden md:flex">
      <div className="space-y-6">
        <div className="px-3.5 text-[11px] uppercase font-extrabold tracking-widest text-[#86868b]">
          Navigation
        </div>

        <nav className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all ${
                  isActive
                    ? 'bg-black text-white font-semibold shadow-2xs scale-[1.01]'
                    : 'text-[#1d1d1f] hover:bg-[#f5f5f7] hover:text-black'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    item.badge === 'Live'
                      ? isActive ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      : isActive ? 'bg-slate-800 text-slate-200' : 'bg-[#e8e8ed] text-slate-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* AI Intelligence Card */}
      <div className="p-5 rounded-3xl bg-[#f5f5f7] space-y-3 border border-[#e5e5e7]">
        <div className="flex items-center space-x-2 text-[#1d1d1f]">
          <Sparkles className="w-4 h-4 text-black" />
          <span className="text-xs font-bold uppercase tracking-wider">AI Engine</span>
        </div>
        <p className="text-xs text-[#6e6e73] leading-relaxed font-medium">
          OpenAI Whisper & GPT-4o engine actively converting speech to tasks & key decisions.
        </p>
        <button 
          onClick={() => setActiveTab('assistant')}
          className="w-full text-center text-xs font-bold text-black py-2 rounded-full bg-white border border-[#e5e5e7] hover:bg-black hover:text-white transition-all shadow-2xs"
        >
          Explore AI Assistant →
        </button>
      </div>
    </aside>
  );
};
