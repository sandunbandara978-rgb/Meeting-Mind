import React from 'react';
import { useMeetingStore } from '../store/useMeetingStore';
import { useAuthStore } from '../store/useAuthStore';
import { WorkspaceSelector } from './WorkspaceSelector';
import { NotificationsDrawer } from './NotificationsDrawer';
import { 
  Mic,
  UploadCloud,
  Sparkles,
  BrainCircuit,
  Search,
  LogOut
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    setActiveTab, 
    setIsUploadModalOpen, 
    setIsAiModalOpen,
    isRecording
  } = useMeetingStore();

  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 navbar-bg sticky top-0 z-40 px-6 flex items-center justify-between gap-4">
      {/* Brand Logo & Status */}
      <div className="flex items-center space-x-3 shrink-0">
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
            <BrainCircuit className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-black">
              MeetingMind
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5e7]">
              AI 2.0
            </span>
          </div>
        </div>

        {isRecording && (
          <div className="flex items-center space-x-2 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <span className="text-xs font-semibold text-rose-700">LIVE RECORDING</span>
          </div>
        )}
      </div>

      {/* Global Search — center */}
      <div className="hidden md:flex items-center relative max-w-sm w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-4" />
        <input 
          type="text" 
          placeholder="Search meetings, decisions, tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#f5f5f7] border border-transparent focus:border-[#d2d2d7] focus:bg-white rounded-full py-1.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs"
        />
      </div>

      {/* Right-side controls */}
      <div className="flex items-center space-x-2.5 shrink-0">

        {/* Workspace & Role Switcher */}
        <WorkspaceSelector />

        <div className="h-4 w-px bg-gray-200 hidden lg:block"></div>

        {/* Quick Actions */}
        <button 
          onClick={() => setActiveTab('studio')}
          className="flex items-center space-x-2 bg-black hover:bg-slate-800 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-full shadow-xs transition-all active:scale-[0.98] hover:scale-[1.02]"
        >
          <Mic className="w-4 h-4" />
          <span className="hidden sm:inline">Record</span>
        </button>

        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center space-x-1.5 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-medium text-xs sm:text-sm px-3.5 py-2 rounded-full transition-all"
          title="Upload Audio File"
        >
          <UploadCloud className="w-4 h-4 text-slate-500" />
          <span className="hidden lg:inline">Upload</span>
        </button>

        <button 
          onClick={() => setIsAiModalOpen(true)}
          className="p-2 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-slate-800 transition-all hover:scale-105"
          title="Ask AI Assistant"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Notifications Bell */}
        <NotificationsDrawer />

        <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>

        {/* User Profile */}
        <div className="flex items-center space-x-2.5 group relative">
          <img 
            src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={user?.name || "User"}
            className="w-8 h-8 rounded-full border border-gray-200 object-cover shadow-2xs"
          />
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-900">{user?.name || 'කසුන් පෙරේරා'}</div>
            <div className="text-[10px] text-slate-500 font-medium">{user?.role === 'ADMIN' ? 'System Admin' : user?.role === 'MANAGER' ? 'Engineering Lead' : 'Employee'}</div>
          </div>
          {/* Logout tooltip */}
          <button
            onClick={logout}
            title="Sign out"
            className="hidden group-hover:flex items-center absolute -bottom-9 right-0 bg-white border border-gray-200 shadow-md text-rose-600 text-[10px] font-bold rounded-xl px-2.5 py-1.5 gap-1 z-50 transition-all hover:bg-rose-50"
          >
            <LogOut className="w-3 h-3" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};
