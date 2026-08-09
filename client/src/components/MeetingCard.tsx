import React from 'react';
import { Meeting } from '../types';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  CheckSquare, 
  FileText, 
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';

interface MeetingCardProps {
  meeting: Meeting;
  onSelect: (id: string) => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onSelect }) => {
  const formattedDate = new Date(meeting.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const durationMinutes = Math.round(meeting.durationSeconds / 60);

  return (
    <div 
      onClick={() => onSelect(meeting.id)}
      className="p-6 rounded-3xl bg-white border border-[#e5e5e7] shadow-2xs hover:shadow-md hover:border-[#d2d2d7] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 space-y-4 group"
    >
      {/* Category Badge & Duration */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5e7]">
          {meeting.category}
        </span>

        <div className="flex items-center space-x-3 text-xs text-[#86868b] font-medium">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{durationMinutes} mins</span>
          </div>
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-[#1d1d1f] group-hover:text-black transition-colors flex items-center justify-between tracking-tight">
          <span>{meeting.title}</span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-black transition-transform group-hover:translate-x-0.5" />
        </h3>
        <p className="text-xs text-[#6e6e73] line-clamp-2 leading-relaxed font-normal">
          {meeting.summary || meeting.description}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {meeting.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[10px] bg-[#f5f5f7] text-[#6e6e73] px-2.5 py-0.5 rounded-full font-medium">
            #{tag}
          </span>
        ))}
      </div>

      {/* Key Metrics Footer */}
      <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-[#86868b] font-medium">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-emerald-700" title="Key Decisions">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-bold text-slate-900">{meeting.decisions.length}</span>
            <span className="text-[10px] text-slate-500">decisions</span>
          </div>
          <div className="flex items-center space-x-1 text-amber-700" title="Extracted Action Items">
            <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-bold text-slate-900">{meeting.tasks.length}</span>
            <span className="text-[10px] text-slate-500">tasks</span>
          </div>
        </div>

        {/* Sentiment Meter */}
        <div className="flex items-center space-x-1.5" title="Meeting Sentiment Score">
          <TrendingUp className="w-3.5 h-3.5 text-slate-700" />
          <span className="font-mono text-xs font-bold text-slate-900">
            {Math.round(meeting.sentimentScore * 100)}% positive
          </span>
        </div>
      </div>
    </div>
  );
};
