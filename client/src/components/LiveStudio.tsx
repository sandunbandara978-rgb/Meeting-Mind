import React, { useState, useEffect } from 'react';
import { useMeetingStore } from '../store/useMeetingStore';
import { useCreateMeeting } from '../services/api';
import { speechService } from '../services/speechService';
import { Decision, Task } from '../types';
import { 
  Mic, 
  Square, 
  Pause, 
  Play, 
  Bookmark, 
  CheckCircle2, 
  Sparkles, 
  UserCheck, 
  Tag, 
  Layers,
  Clock,
  Send,
  AlertCircle
} from 'lucide-react';

const SPEAKERS = ['කසුන් පෙරේරා', 'සාරා ජයසිංහ', 'දිනුක ප්‍රනාන්දු', 'ඉලේෂා වික්‍රමසිංහ'];

export const LiveStudio: React.FC = () => {
  const {
    isRecording,
    setIsRecording,
    recordingTime,
    setRecordingTime,
    activeSpeaker,
    setActiveSpeaker,
    liveTranscripts,
    addLiveTranscript,
    clearLiveTranscripts,
    setActiveTab,
    setSelectedMeetingId
  } = useMeetingStore();

  const createMeetingMutation = useCreateMeeting();

  const [customInput, setCustomInput] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('Product & Engineering Live Sync');
  const [meetingCategory, setMeetingCategory] = useState('Engineering');
  const [isPaused, setIsPaused] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Speech Recognition / Microphone toggle
  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setIsPaused(false);

      // Start speech recognition
      if (speechService.isSupported()) {
        speechService.start((text, isFinal) => {
          if (isFinal) {
            addLiveTranscript({
              id: `t-live-${Date.now()}`,
              speakerName: activeSpeaker,
              timestamp: formatTime(recordingTime),
              text,
              isBookmark: false
            });
          }
        });
      }
    } else {
      setIsPaused(!isPaused);
    }
  };

  const handleBookmark = (type: 'DECISION' | 'ACTION_ITEM' | 'NOTE') => {
    const sampleTexts = {
      DECISION: 'Approved moving forward with the new feature architecture starting next sprint.',
      ACTION_ITEM: 'Create technical specification and post on team wiki by Friday.',
      NOTE: 'Important benchmark result: Request throughput increased by 40%.'
    };

    addLiveTranscript({
      id: `t-bookmark-${Date.now()}`,
      speakerName: activeSpeaker,
      timestamp: formatTime(recordingTime),
      text: customInput || sampleTexts[type],
      isBookmark: true,
      bookmarkType: type
    });

    setCustomInput('');
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    addLiveTranscript({
      id: `t-custom-${Date.now()}`,
      speakerName: activeSpeaker,
      timestamp: formatTime(recordingTime),
      text: customInput,
      isBookmark: false
    });
    setCustomInput('');
  };

  const handleEndSession = async () => {
    speechService.stop();
    setIsRecording(false);

    // Filter bookmarks for instant decision/task creation
    const decisions: Decision[] = liveTranscripts
      .filter((t) => t.bookmarkType === 'DECISION')
      .map((t, idx) => ({ id: `d-live-${idx}`, text: t.text, impactLevel: 'HIGH' }));

    const tasks: Task[] = liveTranscripts
      .filter((t) => t.bookmarkType === 'ACTION_ITEM')
      .map((t, idx) => ({
        id: `task-live-${idx}`,
        title: t.text,
        description: `Extracted from live recording timestamp ${t.timestamp}`,
        status: 'TODO',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        assigneeName: t.speakerName
      }));

    const newMeetingData = {
      title: meetingTitle || 'Live Studio Session',
      category: meetingCategory,
      durationSeconds: recordingTime,
      summary: `Automated summary for ${meetingTitle}. ${liveTranscripts.length} transcript segments were recorded with ${decisions.length} key decisions identified and ${tasks.length} tasks extracted.`,
      transcripts: liveTranscripts.length > 0 ? liveTranscripts : [
        { id: 't-1', speakerName: 'කසුන් පෙරේරා', timestamp: '00:05', text: 'Started live meeting recording in MeetingMind Studio.', isBookmark: false },
        { id: 't-2', speakerName: 'සාරා ජයසිංහ', timestamp: '00:45', text: 'Reviewed sprint goals and task assignments.', isBookmark: true, bookmarkType: 'DECISION' as const }
      ],
      decisions: decisions.length > 0 ? decisions : [
        { id: 'd-sample', text: 'Proceed with planned sprint schedule and deployment.', impactLevel: 'HIGH' as const }
      ],
      tasks: tasks.length > 0 ? tasks : [
        { id: 'task-sample', title: 'Follow up on live meeting notes', description: 'Review summary and action items.', status: 'TODO' as const, priority: 'MEDIUM' as const, assigneeName: 'කසුන් පෙරේරා' }
      ]
    };

    try {
      const savedMeeting = await createMeetingMutation.mutateAsync(newMeetingData);
      clearLiveTranscripts();
      setSelectedMeetingId(savedMeeting.id);
      setActiveTab('meetings');
    } catch (err) {
      console.error('Error saving meeting:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Studio Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              Live Recording Studio
            </span>
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-700" />
              {formatTime(recordingTime)}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <input 
              type="text" 
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className="bg-transparent text-xl font-bold text-slate-900 focus:outline-none border-b border-transparent hover:border-gray-300 focus:border-slate-900 transition-all"
            />
          </div>
        </div>

        {/* Studio Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleRecording}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-xs transition-all ${
              isRecording
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {isRecording ? (
              isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
            <span>{isRecording ? (isPaused ? 'Resume' : 'Pause') : 'Start Recording'}</span>
          </button>

          {isRecording && (
            <button
              onClick={handleEndSession}
              disabled={createMeetingMutation.isPending}
              className="flex items-center space-x-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-2xs transition-all"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>{createMeetingMutation.isPending ? 'Saving...' : 'End & Generate AI Summary'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Transcript Ticker & Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wave Visualizer & Active Speaker Selector */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Active Speaker</span>
              </div>
              <span className="text-xs text-slate-400">Click to switch speaker</span>
            </div>

            {/* Speaker Badges */}
            <div className="flex flex-wrap gap-2">
              {SPEAKERS.map((speaker) => (
                <button
                  key={speaker}
                  onClick={() => setActiveSpeaker(speaker)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeSpeaker === speaker
                      ? 'bg-slate-900 text-white shadow-2xs scale-105'
                      : 'bg-gray-100 text-slate-600 hover:bg-gray-200/80'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{speaker}</span>
                </button>
              ))}
            </div>

            {/* Waveform Visualization */}
            <div className="h-16 bg-gray-100/80 rounded-xl border border-gray-200 flex items-center justify-center space-x-1.5 px-4 overflow-hidden">
              {isRecording && !isPaused ? (
                <>
                  <span className="w-1.5 bg-slate-900 rounded-full animate-wave-1"></span>
                  <span className="w-1.5 bg-slate-800 rounded-full animate-wave-2"></span>
                  <span className="w-1.5 bg-slate-700 rounded-full animate-wave-3"></span>
                  <span className="w-1.5 bg-slate-900 rounded-full animate-wave-4"></span>
                  <span className="w-1.5 bg-slate-800 rounded-full animate-wave-5"></span>
                  <span className="w-1.5 bg-slate-700 rounded-full animate-wave-1"></span>
                  <span className="w-1.5 bg-slate-900 rounded-full animate-wave-3"></span>
                </>
              ) : (
                <span className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                  <Mic className="w-4 h-4 text-slate-400" />
                  {isRecording ? 'Session paused' : 'Microphone standby — Click Start Recording'}
                </span>
              )}
            </div>
          </div>

          {/* Real-Time Transcript Stream */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-4 min-h-[340px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Live Transcript Ticker</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">{liveTranscripts.length} segments</span>
            </div>

            {/* Transcript Messages Feed */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {liveTranscripts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Mic className="w-8 h-8 mx-auto text-slate-300 animate-pulse" />
                  <p className="text-sm font-medium">Speak into your microphone or type below to stream speech to text.</p>
                </div>
              ) : (
                liveTranscripts.map((t) => (
                  <div
                    key={t.id}
                    className={`p-3.5 rounded-xl text-sm space-y-1 transition-all ${
                      t.isBookmark
                        ? 'bg-slate-50 border border-slate-300'
                        : 'bg-gray-50/70 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span className="font-bold text-slate-900">{t.speakerName}</span>
                      <div className="flex items-center space-x-2">
                        {t.bookmarkType && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            t.bookmarkType === 'DECISION'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : t.bookmarkType === 'ACTION_ITEM'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-200 text-slate-800'
                          }`}>
                            {t.bookmarkType}
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-slate-400">{t.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-slate-800 leading-relaxed">{t.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Live Input & Moment Tagging Toolbar */}
            <form onSubmit={handleSendText} className="space-y-3 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Add text segment as ${activeSpeaker}...`}
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="flex-1 bg-gray-100/80 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-2xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Tagging Buttons */}
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick Tag:</span>
                <button
                  type="button"
                  onClick={() => handleBookmark('DECISION')}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold transition-all"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Decision</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBookmark('ACTION_ITEM')}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold transition-all"
                >
                  <Bookmark className="w-3 h-3 text-amber-600" />
                  <span>Action Item</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Live AI Extraction Drawer */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2 text-slate-900">
                <Sparkles className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Live AI Intelligence</span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full border border-slate-200 font-bold">
                GPT-4o
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Tagged Decisions ({liveTranscripts.filter(t => t.bookmarkType === 'DECISION').length})
                </span>
                <div className="space-y-1.5">
                  {liveTranscripts.filter(t => t.bookmarkType === 'DECISION').length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No decisions tagged yet.</p>
                  ) : (
                    liveTranscripts.filter(t => t.bookmarkType === 'DECISION').map(t => (
                      <div key={t.id} className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-slate-800 font-medium">
                        {t.text}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                  Extracted Tasks ({liveTranscripts.filter(t => t.bookmarkType === 'ACTION_ITEM').length})
                </span>
                <div className="space-y-1.5">
                  {liveTranscripts.filter(t => t.bookmarkType === 'ACTION_ITEM').length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No action items tagged yet.</p>
                  ) : (
                    liveTranscripts.filter(t => t.bookmarkType === 'ACTION_ITEM').map(t => (
                      <div key={t.id} className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-slate-800 font-medium flex justify-between items-center">
                        <span>{t.text}</span>
                        <span className="text-[10px] text-amber-800 font-bold">{t.speakerName}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
