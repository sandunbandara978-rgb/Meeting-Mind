import { create } from 'zustand';
import { ActiveTab, Meeting, TranscriptSegment } from '../types';

interface MeetingStoreState {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedMeetingId: string | null;
  setSelectedMeetingId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  
  // Live Studio State
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  recordingTime: number;
  setRecordingTime: (fn: number | ((prev: number) => number)) => void;
  activeSpeaker: string;
  setActiveSpeaker: (speaker: string) => void;
  liveTranscripts: TranscriptSegment[];
  addLiveTranscript: (segment: TranscriptSegment) => void;
  clearLiveTranscripts: () => void;
  
  // Modals
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
}

export const useMeetingStore = create<MeetingStoreState>((set) => ({
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectedMeetingId: null,
  setSelectedMeetingId: (id) => set({ selectedMeetingId: id }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  categoryFilter: 'ALL',
  setCategoryFilter: (category) => set({ categoryFilter: category }),

  // Live Studio
  isRecording: false,
  setIsRecording: (isRecording) => set({ isRecording }),
  recordingTime: 0,
  setRecordingTime: (fn) => set((state) => ({
    recordingTime: typeof fn === 'function' ? fn(state.recordingTime) : fn
  })),
  activeSpeaker: 'කසුන් පෙරේරා',
  setActiveSpeaker: (speaker) => set({ activeSpeaker: speaker }),
  liveTranscripts: [],
  addLiveTranscript: (segment) => set((state) => ({ liveTranscripts: [...state.liveTranscripts, segment] })),
  clearLiveTranscripts: () => set({ liveTranscripts: [], recordingTime: 0 }),

  // Modals
  isUploadModalOpen: false,
  setIsUploadModalOpen: (open) => set({ isUploadModalOpen: open }),
  isAiModalOpen: false,
  setIsAiModalOpen: (open) => set({ isAiModalOpen: open })
}));
