import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { transcribeAudioWithWhisper, summarizeMeetingTranscript } from '../services/openaiService';

// In-memory initial high-quality sample meetings for immediate API availability
let SAMPLE_MEETINGS = [
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
];

export async function getMeetings(req: AuthRequest, res: Response) {
  return res.json({ meetings: SAMPLE_MEETINGS });
}

export async function getMeetingById(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const meeting = SAMPLE_MEETINGS.find(m => m.id === id);
  if (!meeting) {
    return res.status(404).json({ error: 'Meeting not found' });
  }
  return res.json({ meeting });
}

export async function createMeeting(req: AuthRequest, res: Response) {
  try {
    const { title, description, category, durationSeconds, transcripts, summary, decisions, tasks, tags } = req.body;
    const newMeeting = {
      id: `m-${Date.now()}`,
      title: title || 'Untitled Recorded Meeting',
      description: description || 'Recorded live in MeetingMind Studio',
      category: category || 'General',
      status: 'COMPLETED',
      durationSeconds: durationSeconds || 120,
      date: new Date().toISOString(),
      summary: summary || 'Automatic AI summary generated from recorded live session.',
      sentimentScore: 0.90,
      tags: tags || ['Live Session'],
      userId: req.user?.id || 'demo-user-123',
      decisions: decisions || [],
      transcripts: transcripts || [],
      tasks: tasks || []
    };

    SAMPLE_MEETINGS.unshift(newMeeting);
    return res.status(201).json({ meeting: newMeeting });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save meeting' });
  }
}

export async function deleteMeeting(req: AuthRequest, res: Response) {
  const { id } = req.params;
  SAMPLE_MEETINGS = SAMPLE_MEETINGS.filter(m => m.id !== id);
  return res.json({ success: true, message: 'Meeting deleted successfully' });
}

export async function transcribeAudio(req: AuthRequest, res: Response) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const transcript = await transcribeAudioWithWhisper(file.buffer, file.originalname);
    const summaryData = await summarizeMeetingTranscript(transcript);

    const newMeeting = {
      id: `m-upload-${Date.now()}`,
      title: `Uploaded Recording: ${file.originalname.replace(/\.[^/.]+$/, '')}`,
      description: 'Processed via OpenAI Whisper & GPT-4o AI engine',
      category: 'Audio Upload',
      status: 'COMPLETED',
      durationSeconds: 300,
      date: new Date().toISOString(),
      summary: summaryData.summary,
      sentimentScore: summaryData.sentimentScore,
      tags: ['Whisper AI', 'Audio Upload'],
      userId: req.user?.id || 'demo-user-123',
      decisions: summaryData.decisions.map((d, i) => ({ id: `d-up-${i}`, text: d.text, impactLevel: d.impactLevel })),
      transcripts: transcript.split('\n').map((line, i) => ({
        id: `t-up-${i}`,
        speakerName: line.includes(':') ? line.split(':')[0] : 'Speaker',
        timestamp: `0${Math.floor(i / 2)}:00`,
        text: line.includes(':') ? line.split(':').slice(1).join(':').trim() : line,
        isBookmark: false
      })),
      tasks: summaryData.actionItems.map((a, i) => ({
        id: `task-up-${i}`,
        title: a.title,
        description: a.description || '',
        status: 'TODO',
        priority: a.priority as any || 'MEDIUM',
        dueDate: a.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        assigneeName: a.assigneeName || 'Unassigned'
      }))
    };

    SAMPLE_MEETINGS.unshift(newMeeting);
    return res.json({ meeting: newMeeting, summaryData });
  } catch (error) {
    console.error('Transcription error:', error);
    return res.status(500).json({ error: 'Failed to transcribe audio' });
  }
}
