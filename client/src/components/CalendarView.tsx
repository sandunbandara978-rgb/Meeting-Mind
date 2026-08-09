import React, { useState } from 'react';
import { useMeetings } from '../services/api';
import { useMeetingStore } from '../store/useMeetingStore';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Video, 
  CheckCircle2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { data: meetings = [] } = useMeetings();
  const { setSelectedMeetingId, setActiveTab } = useMeetingStore();

  const [currentMonth, setCurrentMonth] = useState('July 2026');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-07-28');
  const [newCategory, setNewCategory] = useState('Engineering');

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const upcomingMeetings = [
    {
      id: 'sched-1',
      title: 'Q3 Architecture & Security Review',
      date: '2026-07-25T14:00:00Z',
      time: '02:00 PM - 03:00 PM',
      category: 'Engineering',
      participants: ['කසුන් පෙරේරා', 'ඉලේෂා වික්‍රමසිංහ', 'දිනුක ප්‍රනාන්දු'],
      purpose: 'Review SOC2 encryption progress and AWS KMS setup.',
      isGoogleSynced: true
    },
    {
      id: 'sched-2',
      title: 'Sprint Retrospective & Backlog Grooming',
      date: '2026-07-27T10:00:00Z',
      time: '10:00 AM - 11:30 AM',
      category: 'Product',
      participants: ['සාරා ජයසිංහ', 'කසුන් පෙරේරා', 'යසෝධා තිලකරත්න'],
      purpose: 'Groom sprint backlog and assign Q3 action items.',
      isGoogleSynced: true
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-slate-800" />
            Meeting Schedule & Calendar Sync
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Schedule upcoming meetings with automatic Google Calendar sync and task integration.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Google Calendar Synced
          </span>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar Month Grid + Upcoming Events Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Grid */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">{currentMonth}</h3>
            <div className="flex space-x-1">
              <button className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-gray-100">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-gray-100">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase tracking-wider text-slate-400 py-1">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const isToday = day === 22;
              const hasMeeting = day === 20 || day === 21 || day === 25 || day === 27;

              return (
                <div
                  key={day}
                  className={`min-h-[70px] p-2 rounded-xl border flex flex-col justify-between transition-all ${
                    isToday
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : hasMeeting
                      ? 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      : 'bg-white border-gray-100'
                  }`}
                >
                  <span className={`text-xs font-bold ${isToday ? 'text-white' : 'text-slate-800'}`}>
                    {day}
                  </span>

                  {hasMeeting && (
                    <div className={`text-[9px] font-semibold px-1.5 py-0.5 rounded truncate ${
                      isToday ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {day === 25 ? 'Live Sync' : 'Meeting'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Upcoming Scheduled Meetings */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Upcoming Scheduled Meetings</h3>

            <div className="space-y-3">
              {upcomingMeetings.map((mtg) => (
                <div
                  key={mtg.id}
                  className="p-4 rounded-xl bg-gray-50/80 border border-gray-200 space-y-2.5 hover:border-gray-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {mtg.category}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                      <ExternalLink className="w-3 h-3 text-emerald-600" />
                      Google Sync
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{mtg.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{mtg.purpose}</p>

                  <div className="pt-2 border-t border-gray-200/70 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-600" />
                      {mtg.time}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-900">
                      <UserCheck className="w-3 h-3 text-slate-600" />
                      {mtg.participants.length} attendees
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white border border-gray-200 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-slate-700" />
              Schedule New Meeting
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsScheduleModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Roadmap Review"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-gray-100/80 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-gray-100/80 border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-gray-100/80 border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-slate-700 text-xs font-semibold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-2xs"
                >
                  Sync to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
