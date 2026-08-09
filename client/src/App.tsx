import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMeetingStore } from './store/useMeetingStore';
import { useAuthStore } from './store/useAuthStore';
import { useMeetings, useTasks } from './services/api';
import { socketService } from './services/socketService';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LiveStudio } from './components/LiveStudio';
import { MeetingCard } from './components/MeetingCard';
import { MeetingDetail } from './components/MeetingDetail';
import { TaskBoard } from './components/TaskBoard';
import { AiChatModal } from './components/AiChatModal';
import { FileUploadModal } from './components/FileUploadModal';
import { AnalyticsView } from './components/AnalyticsView';
import { CalendarView } from './components/CalendarView';
import { AdminConsole } from './components/AdminConsole';

import { 
  Mic, 
  UploadCloud, 
  Video, 
  CheckSquare, 
  Sparkles, 
  Plus, 
  BrainCircuit,
  ShieldAlert
} from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

// ─── Dashboard ───────────────────────────────────────────────────────────────

const MainDashboard: React.FC = () => {
  const { data: meetings = [] } = useMeetings();
  const { data: tasks = [] } = useTasks();
  const { 
    setActiveTab, 
    setSelectedMeetingId, 
    setIsUploadModalOpen, 
    setIsAiModalOpen,
    categoryFilter,
    setCategoryFilter,
    searchQuery
  } = useMeetingStore();

  const { activeWorkspaceId } = useAuthStore();

  // Filter by workspace & search
  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || m.category === categoryFilter;
    const matchesWorkspace = !m.workspaceId || m.workspaceId === activeWorkspaceId;
    return matchesSearch && matchesCat && matchesWorkspace;
  });

  const pendingTasks = tasks.filter((t) => t.status !== 'DONE');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Hero Welcome Banner - Inspiring Apple Style */}
      <div className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-white border border-[#e5e5e7] shadow-2xs space-y-6">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#f5f5f7] border border-[#e5e5e7] text-[#1d1d1f] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>AI Meeting Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1d1d1f] tracking-tight leading-tight">
            MeetingMind. Pure intelligence for every conversation.
          </h1>

          <p className="text-base text-[#6e6e73] leading-relaxed font-normal max-w-2xl">
            Transform live discussions into clear summaries, documented decisions, and actionable tasks with OpenAI Whisper & GPT-4o.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => setActiveTab('studio')}
              className="flex items-center space-x-2 bg-black hover:bg-slate-800 text-white font-medium text-xs sm:text-sm px-6 py-3 rounded-full shadow-xs transition-all active:scale-[0.98] hover:scale-[1.02]"
            >
              <Mic className="w-4 h-4" />
              <span>Start Live Recording Studio</span>
            </button>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center space-x-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-medium text-xs sm:text-sm px-5 py-3 rounded-full transition-all"
            >
              <UploadCloud className="w-4 h-4 text-slate-600" />
              <span>Upload Audio</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className="flex items-center space-x-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-medium text-xs sm:text-sm px-5 py-3 rounded-full transition-all"
            >
              <Plus className="w-4 h-4 text-slate-600" />
              <span>Schedule Meeting</span>
            </button>
          </div>
        </div>

        {/* Decorative Subtle Gradient Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#f5f5f7] to-transparent pointer-events-none rounded-r-3xl"></div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-[#e5e5e7] shadow-2xs space-y-1 hover:border-[#d2d2d7] transition-all">
          <span className="text-xs font-bold text-[#86868b] uppercase tracking-widest">Total Meetings</span>
          <div className="text-4xl font-extrabold text-[#1d1d1f] font-mono">{filteredMeetings.length}</div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#e5e5e7] shadow-2xs space-y-1 hover:border-[#d2d2d7] transition-all">
          <span className="text-xs font-bold text-[#86868b] uppercase tracking-widest">Documented Decisions</span>
          <div className="text-4xl font-extrabold text-emerald-700 font-mono">
            {filteredMeetings.reduce((acc, m) => acc + m.decisions.length, 0)}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#e5e5e7] shadow-2xs space-y-1 hover:border-[#d2d2d7] transition-all">
          <span className="text-xs font-bold text-[#86868b] uppercase tracking-widest">Pending Action Items</span>
          <div className="text-4xl font-extrabold text-amber-700 font-mono">{pendingTasks.length}</div>
        </div>
      </div>

      {/* Main Grid: Recent Meetings + Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Meetings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2 tracking-tight">
              <Video className="w-5 h-5 text-slate-800" />
              Recent Meetings
            </h2>

            {/* Category Filter */}
            <div className="flex items-center space-x-1.5">
              {['ALL', 'Engineering', 'Marketing'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    categoryFilter === cat
                      ? 'bg-black text-white shadow-2xs'
                      : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredMeetings.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-dashed border-gray-300 text-center space-y-3">
              <Video className="w-10 h-10 mx-auto text-slate-400" />
              <p className="text-sm text-slate-500 font-medium">No meetings found for this workspace or filter.</p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="text-xs text-black font-bold hover:underline"
              >
                Upload your first recording →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMeetings.map((m) => (
                <MeetingCard
                  key={m.id}
                  meeting={m}
                  onSelect={(id) => {
                    setSelectedMeetingId(id);
                    setActiveTab('meetings');
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Pending Tasks Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2 tracking-tight">
              <CheckSquare className="w-5 h-5 text-slate-800" />
              Pending Action Items
            </h2>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs text-black font-bold hover:underline"
            >
              View Board →
            </button>
          </div>

          <div className="space-y-3">
            {pendingTasks.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-dashed border-gray-300 text-center text-xs text-slate-500 font-medium">
                🎉 All tasks are complete!
              </div>
            ) : (
              pendingTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="p-5 rounded-2xl bg-white border border-[#e5e5e7] shadow-2xs space-y-2.5 hover:border-[#d2d2d7] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f]">
                      {task.status}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {task.priority}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{task.title}</h4>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Assignee: <strong className="text-slate-900">{task.assigneeName || 'Unassigned'}</strong></span>
                    <span>Due: {task.dueDate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Content Router ───────────────────────────────────────────────────────────

const ContentArea: React.FC = () => {
  const { activeTab, selectedMeetingId, setSelectedMeetingId } = useMeetingStore();
  const { user } = useAuthStore();
  const { data: meetings = [] } = useMeetings();

  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId) || meetings[0];

  if (activeTab === 'studio') return <LiveStudio />;
  if (activeTab === 'tasks') return <TaskBoard />;
  if (activeTab === 'analytics') return <AnalyticsView />;
  if (activeTab === 'calendar') return <CalendarView />;

  // Admin tab — RBAC guarded
  if (activeTab === 'admin') {
    if (user?.role !== 'ADMIN') {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-4 pt-24">
          <ShieldAlert className="w-16 h-16 text-rose-500" />
          <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
          <p className="text-sm text-slate-500 text-center max-w-sm">
            You need <strong className="text-slate-900">System Admin</strong> privileges to view this page. Use the Role switcher in the top bar to test permissions.
          </p>
        </div>
      );
    }
    return <AdminConsole />;
  }

  if (activeTab === 'assistant') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        <div className="p-6 rounded-2xl bg-white border border-gray-200 text-center space-y-3 shadow-2xs">
          <BrainCircuit className="w-12 h-12 mx-auto text-slate-800" />
          <h2 className="text-2xl font-extrabold text-slate-900">AI Knowledge Base & Assistant</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
            Query all recorded meeting transcripts, decisions, and action items with natural language prompts.
          </p>
        </div>
        <AiChatModal />
      </div>
    );
  }

  if (activeTab === 'meetings') {
    if (selectedMeetingId && selectedMeeting) {
      return (
        <MeetingDetail
          meeting={selectedMeeting}
          onBack={() => setSelectedMeetingId(null)}
        />
      );
    }

    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-16">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Video className="w-6 h-6 text-slate-800" />
            Meetings Library
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((m) => (
            <MeetingCard
              key={m.id}
              meeting={m}
              onSelect={(id) => setSelectedMeetingId(id)}
            />
          ))}
        </div>
      </div>
    );
  }

  return <MainDashboard />;
};

// ─── App Shell ────────────────────────────────────────────────────────────────

export const AppContent: React.FC = () => {
  const { user } = useAuthStore();

  // Initialize WebSocket connection when user is authenticated
  useEffect(() => {
    if (user) {
      socketService.connect(user.id);

      socketService.on('notification', (data: { title: string; message: string }) => {
        console.log('[Socket] notification received:', data);
        // Could push to a notifications store here
      });

      socketService.on('meeting:updated', (data: { meetingId: string }) => {
        console.log('[Socket] meeting updated:', data.meetingId);
        queryClient.invalidateQueries({ queryKey: ['meetings'] });
      });

      socketService.on('task:assigned', (data: { taskId: string }) => {
        console.log('[Socket] task assigned:', data.taskId);
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      });
    }

    return () => {
      socketService.disconnect();
    };
  }, [user?.id]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <ContentArea />
        </main>
      </div>

      <FileUploadModal />
      <AiChatModal />
    </div>
  );
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
