export type ActiveTab = 'dashboard' | 'studio' | 'meetings' | 'tasks' | 'calendar' | 'analytics' | 'assistant' | 'admin';

export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Team {
  id: string;
  name: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  teams: Team[];
  members: WorkspaceMember[];
}

export interface TranscriptSegment {
  id: string;
  speakerName: string;
  timestamp: string;
  text: string;
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'CONCERN';
  isBookmark?: boolean;
  bookmarkType?: 'DECISION' | 'ACTION_ITEM' | 'NOTE';
}

export interface Decision {
  id: string;
  text: string;
  impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface TopicSummary {
  topicName: string;
  description: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assigneeName?: string;
  meetingTitle?: string;
  meetingId?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: 'TASK_ASSIGNED' | 'MEETING_REMINDER' | 'SYSTEM';
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: 'RECORDING' | 'PROCESSING' | 'COMPLETED';
  durationSeconds: number;
  date: string;
  summary: string;
  detailedTopics?: TopicSummary[];
  sentimentScore: number;
  tags: string[];
  userId: string;
  workspaceId?: string;
  decisions: Decision[];
  transcripts: TranscriptSegment[];
  tasks: Task[];
}
