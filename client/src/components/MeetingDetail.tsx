import React, { useState } from 'react';
import { Meeting } from '../types';
import { useMeetingStore } from '../store/useMeetingStore';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Bookmark, 
  FileText, 
  Download, 
  Copy, 
  Share2, 
  Sparkles, 
  User, 
  Search, 
  TrendingUp, 
  PieChart, 
  CheckSquare,
  Check
} from 'lucide-react';

interface MeetingDetailProps {
  meeting: Meeting;
  onBack: () => void;
}

export const MeetingDetail: React.FC<MeetingDetailProps> = ({ meeting, onBack }) => {
  const { setActiveTab } = useMeetingStore();
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'transcript' | 'tasks' | 'analytics'>('summary');
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [selectedSpeakerFilter, setSelectedSpeakerFilter] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date(meeting.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const durationMinutes = Math.round(meeting.durationSeconds / 60);

  // Unique speakers
  const speakers = Array.from(new Set(meeting.transcripts.map((t) => t.speakerName)));

  // Filtered transcript
  const filteredTranscripts = meeting.transcripts.filter((t) => {
    const matchesSearch = t.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
                          t.speakerName.toLowerCase().includes(transcriptSearch.toLowerCase());
    const matchesSpeaker = selectedSpeakerFilter === 'ALL' || t.speakerName === selectedSpeakerFilter;
    return matchesSearch && matchesSpeaker;
  });

  const handleCopySummary = () => {
    const textToCopy = `MEETING SUMMARY: ${meeting.title}\nDate: ${formattedDate}\n\nEXECUTIVE SUMMARY:\n${meeting.summary}\n\nKEY DECISIONS:\n${meeting.decisions.map(d => `- ${d.text}`).join('\n')}\n\nACTION ITEMS:\n${meeting.tasks.map(t => `- [${t.status}] ${t.title} (Assignee: ${t.assigneeName})`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const markdownContent = `# ${meeting.title}\n**Date:** ${formattedDate}  \n**Duration:** ${durationMinutes} minutes  \n**Category:** ${meeting.category}\n\n## Executive Summary\n${meeting.summary}\n\n## Key Decisions\n${meeting.decisions.map(d => `- **[${d.impactLevel}]** ${d.text}`).join('\n')}\n\n## Action Items & Tasks\n${meeting.tasks.map(t => `- [x] **${t.title}** - *${t.assigneeName}* (Priority: ${t.priority}, Due: ${t.dueDate})`).join('\n')}\n\n## Transcript\n${meeting.transcripts.map(t => `**${t.speakerName}** (${t.timestamp}): ${t.text}`).join('\n\n')}`;

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meeting.title.toLowerCase().replace(/\s+/g, '_')}_notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 text-sm font-semibold transition-all hover:-translate-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Meetings</span>
        </button>

        {/* Action Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 text-slate-800 text-xs font-semibold border border-gray-200 shadow-2xs transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied!' : 'Copy Notes'}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Markdown</span>
          </button>
        </div>
      </div>

      {/* Main Title Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              {meeting.category}
            </span>
            <span className="text-xs text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
              {meeting.status}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-500 font-medium">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{durationMinutes} minutes</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900">{meeting.title}</h1>
        <p className="text-sm text-slate-600 leading-relaxed">{meeting.description}</p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-gray-200 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveSubTab('summary')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeSubTab === 'summary'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Summary & Decisions</span>
        </button>

        <button
          onClick={() => setActiveSubTab('transcript')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeSubTab === 'transcript'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Full Transcript ({meeting.transcripts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tasks')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeSubTab === 'tasks'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Action Items ({meeting.tasks.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeSubTab === 'analytics'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Speaker Analytics</span>
        </button>
      </div>

      {/* Tab 1: Executive Summary & Key Decisions */}
      {activeSubTab === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Panel */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 text-slate-900">
                <Sparkles className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Executive Summary</h3>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed font-sans font-normal">
                {meeting.summary}
              </p>
            </div>

            {/* Key Decisions Panel */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-4">
              <div className="flex items-center space-x-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Key Decisions Agreed</h3>
              </div>

              <div className="space-y-3">
                {meeting.decisions.map((decision) => (
                  <div
                    key={decision.id}
                    className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-start justify-between gap-3"
                  >
                    <p className="text-sm text-slate-900 leading-normal font-medium">{decision.text}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                      {decision.impactLevel} IMPACT
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Quick Task List */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center space-x-2 text-slate-900">
                  <Bookmark className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Created Tasks</h3>
                </div>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-xs text-slate-900 font-bold hover:underline"
                >
                  Manage Board →
                </button>
              </div>

              <div className="space-y-3">
                {meeting.tasks.map((task) => (
                  <div key={task.id} className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{task.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 font-bold">
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>Assignee: {task.assigneeName || 'Unassigned'}</span>
                      <span>Due: {task.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Full Timestamped Transcript */}
      {activeSubTab === 'transcript' && (
        <div className="space-y-4">
          {/* Transcript Search & Speaker Filters */}
          <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search transcript..."
                value={transcriptSearch}
                onChange={(e) => setTranscriptSearch(e.target.value)}
                className="w-full bg-gray-100/80 border border-gray-200 rounded-xl py-1.5 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-semibold">Filter Speaker:</span>
              <button
                onClick={() => setSelectedSpeakerFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  selectedSpeakerFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                }`}
              >
                All Speakers
              </button>
              {speakers.map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSelectedSpeakerFilter(sp)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    selectedSpeakerFilter === sp ? 'bg-slate-900 text-white' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          {/* Transcript Segment List */}
          <div className="space-y-3">
            {filteredTranscripts.map((segment) => (
              <div
                key={segment.id}
                className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-2xs space-y-1.5 hover:border-gray-300 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-slate-700" />
                    <span className="font-bold text-slate-900">{segment.speakerName}</span>
                  </div>
                  <span className="font-mono text-slate-400">{segment.timestamp}</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed pl-4 border-l-2 border-slate-300">
                  {segment.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Action Items */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meeting.tasks.map((task) => (
              <div key={task.id} className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                    {task.status}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                    {task.priority} PRIORITY
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900">{task.title}</h4>
                <p className="text-xs text-slate-600">{task.description}</p>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Assignee: <strong className="text-slate-900">{task.assigneeName || 'Unassigned'}</strong></span>
                  <span>Due: <strong className="text-slate-900">{task.dueDate}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Speaker Analytics & Sentiment */}
      {activeSubTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Speaker Talk Time Share</h3>
            <div className="space-y-3">
              {speakers.map((sp) => {
                const spCount = meeting.transcripts.filter(t => t.speakerName === sp).length;
                const pct = Math.round((spCount / meeting.transcripts.length) * 100);
                return (
                  <div key={sp} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="font-bold text-slate-900">{sp}</span>
                      <span className="font-mono text-slate-900 font-bold">{pct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Meeting Sentiment Meter</h3>
              <p className="text-xs text-slate-500 mt-1">NLP Sentiment calculated across speaker turn dynamics.</p>
            </div>

            <div className="text-center py-6 space-y-2">
              <div className="text-5xl font-extrabold text-slate-900 font-mono">
                {Math.round(meeting.sentimentScore * 100)}%
              </div>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">High Alignment & Positivity</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
