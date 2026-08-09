import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Meeting, Task } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('meetingmind_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// React Query Hooks

export function useMeetings() {
  return useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/meetings');
        return res.data.meetings as Meeting[];
      } catch (e) {
        console.warn('Backend API unreachable - providing high-fidelity client mock meetings dataset.');
        return [
          {
            id: 'm-1',
            title: 'Q3 Product Architecture & API Alignment',
            description: 'Alignment meeting to review GraphQL migration benchmarks, security KMS configuration, and task sync pipelines.',
            category: 'Engineering',
            status: 'COMPLETED',
            durationSeconds: 1840,
            date: new Date('2026-07-21T14:30:00Z').toISOString(),
            summary: 'The engineering team evaluated GraphQL API benchmark results showing a 38% reduction in frontend request latency. The decision was approved to mandate GraphQL for all new feature modules starting next sprint. SOC2 encryption standards were reviewed and ඉලේෂා will configure AWS KMS envelope encryption by Friday.',
            sentimentScore: 0.94,
            tags: ['Architecture', 'GraphQL', 'SOC2', 'API'],
            userId: 'demo-user-123',
            decisions: [
              { id: 'd-1', text: 'Mandate GraphQL as standard API protocol for all new backend feature modules starting next sprint.', impactLevel: 'HIGH' },
              { id: 'd-2', text: 'Implement AWS KMS envelope encryption for stored meeting audio chunks to satisfy SOC2 compliance.', impactLevel: 'HIGH' },
              { id: 'd-3', text: 'Maintain legacy REST endpoints with full backward-compatibility until Q4 deprecation milestone.', impactLevel: 'MEDIUM' }
            ],
            transcripts: [
              { id: 't-1', speakerName: 'කසුන් පෙරේරා', timestamp: '00:05', text: "Thanks everyone for joining today's Q3 Architecture & Product alignment meeting. We have three main agenda items: finalization of the GraphQL API migration, standardizing task sync with MeetingMind, and setting timelines for our security audit.", isBookmark: true, bookmarkType: 'NOTE' },
              { id: 't-2', speakerName: 'සාරා ජයසිංහ', timestamp: '01:12', text: "On the API side, our team completed the benchmark tests. GraphQL reduced frontend request latency by 38% compared to REST. We should mandate GraphQL for all new feature modules starting next sprint.", isBookmark: true, bookmarkType: 'DECISION' },
              { id: 't-3', speakerName: 'දිනුක ප්‍රනාන්දු', timestamp: '02:45', text: "I agree with Sarah. However, we must ensure retro-compatibility with legacy REST endpoints until Q4. I'll take responsibility for writing the migration guide for the dev team.", isBookmark: true, bookmarkType: 'ACTION_ITEM' },
              { id: 't-4', speakerName: 'ඉලේෂා වික්‍රමසිංහ', timestamp: '04:10', text: "Regarding the security audit, SOC2 compliance mandates end-to-end encryption for stored meeting audio chunks. I'll implement AWS KMS envelope encryption by Friday.", isBookmark: true, bookmarkType: 'ACTION_ITEM' },
              { id: 't-5', speakerName: 'කසුන් පෙරේරා', timestamp: '05:30', text: "Excellent. Let's record decisions: 1) Migrate all new endpoints to GraphQL. 2) Encrypt all audio files at rest. David will draft the API migration guide, Elena will configure KMS encryption by Friday, and I'll notify stakeholders.", isBookmark: false }
            ],
            tasks: [
              { id: 'task-1', title: 'Draft GraphQL API Migration Guide for dev team', description: 'Create comprehensive guidelines and code examples.', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-07-28', assigneeName: 'දිනුක ප්‍රනාන්දු' },
              { id: 'task-2', title: 'Configure AWS KMS Envelope Encryption', description: 'Set up encryption keys and update S3 upload pipeline.', status: 'TODO', priority: 'URGENT', dueDate: '2026-07-25', assigneeName: 'ඉලේෂා වික්‍රමසිංහ' },
              { id: 'task-3', title: 'Publish Q3 Security & Architecture roadmap update', description: 'Notify engineering leads and product managers.', status: 'DONE', priority: 'MEDIUM', dueDate: '2026-07-30', assigneeName: 'කසුන් පෙරේරා' }
            ]
          },
          {
            id: 'm-2',
            title: 'Marketing Campaign & Product Launch Sync',
            description: 'Weekly sync with marketing and design teams on Q3 product messaging, landing page design, and social media schedule.',
            category: 'Marketing',
            status: 'COMPLETED',
            durationSeconds: 1420,
            date: new Date('2026-07-20T10:00:00Z').toISOString(),
            summary: 'Discussed the upcoming launch strategy for MeetingMind v2.0. Agreed on an interactive video demo for the landing page hero section. Allocated budget for targeted LinkedIn developer campaigns.',
            sentimentScore: 0.88,
            tags: ['Launch', 'Marketing', 'UI/UX', 'Growth'],
            userId: 'demo-user-123',
            decisions: [
              { id: 'd-4', text: 'Feature a live 30-second interactive canvas demo directly on the homepage hero section.', impactLevel: 'HIGH' },
              { id: 'd-5', text: 'Approve $15k growth marketing budget for targeted developer platform ads.', impactLevel: 'MEDIUM' }
            ],
            transcripts: [
              { id: 't-6', speakerName: 'කසුන් පෙරේරා', timestamp: '00:10', text: "Welcome team! Today we are reviewing the final marketing assets for the upcoming MeetingMind release.", isBookmark: false },
              { id: 't-7', speakerName: 'යසෝධා තිලකරත්න', timestamp: '01:30', text: "The landing page design is ready. We want to show live real-time speech transcription in an interactive window.", isBookmark: true, bookmarkType: 'DECISION' },
              { id: 't-8', speakerName: 'මාලක සංජය', timestamp: '03:15', text: "I will finalize the video production for product walkthrough by Wednesday.", isBookmark: true, bookmarkType: 'ACTION_ITEM' }
            ],
            tasks: [
              { id: 'task-4', title: 'Finalize product walkthrough video production', description: 'Produce HD demo video for landing page and YouTube.', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-07-26', assigneeName: 'මාලක සංජය' },
              { id: 'task-5', title: 'Launch LinkedIn Developer Ad Campaign', description: 'Set up ad targeting for software engineers and engineering managers.', status: 'TODO', priority: 'MEDIUM', dueDate: '2026-08-01', assigneeName: 'යසෝධා තිලකරත්න' }
            ]
          }
        ] as Meeting[];
      }
    }
  });
}

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/tasks');
        return res.data.tasks as Task[];
      } catch (e) {
        return [
          { id: 'task-1', title: 'Draft GraphQL API Migration Guide for dev team', description: 'Create comprehensive guidelines and code examples.', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-07-28', assigneeName: 'දිනුක ප්‍රනාන්දු', meetingTitle: 'Q3 Product Architecture & API Alignment' },
          { id: 'task-2', title: 'Configure AWS KMS Envelope Encryption', description: 'Set up encryption keys and update S3 upload pipeline.', status: 'TODO', priority: 'URGENT', dueDate: '2026-07-25', assigneeName: 'ඉලේෂා වික්‍රමසිංහ', meetingTitle: 'Q3 Product Architecture & API Alignment' },
          { id: 'task-3', title: 'Publish Q3 Security & Architecture roadmap update', description: 'Notify engineering leads and product managers.', status: 'DONE', priority: 'MEDIUM', dueDate: '2026-07-30', assigneeName: 'කසුන් පෙරේරා', meetingTitle: 'Q3 Product Architecture & API Alignment' },
          { id: 'task-4', title: 'Finalize product walkthrough video production', description: 'Produce HD demo video for landing page and YouTube.', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-07-26', assigneeName: 'මාලක සංජය', meetingTitle: 'Marketing Campaign & Product Launch Sync' },
          { id: 'task-5', title: 'Launch LinkedIn Developer Ad Campaign', description: 'Set up ad targeting for software engineers and engineering managers.', status: 'TODO', priority: 'MEDIUM', dueDate: '2026-08-01', assigneeName: 'යසෝධා තිලකරත්න', meetingTitle: 'Marketing Campaign & Product Launch Sync' }
        ] as Task[];
      }
    }
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (meetingData: Partial<Meeting>) => {
      const res = await apiClient.post('/meetings', meetingData);
      return res.data.meeting;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      const res = await apiClient.patch(`/tasks/${id}`, updates);
      return res.data.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    }
  });
}

export function useUploadAudio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('audio', file);
      const res = await apiClient.post('/meetings/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
}

export function useAskAi() {
  return useMutation({
    mutationFn: async (query: string) => {
      const res = await apiClient.post('/ai/chat', { query });
      return res.data.reply as string;
    }
  });
}
