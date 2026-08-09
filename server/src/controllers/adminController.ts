import { Request, Response } from 'express';

export async function getAdminSystemMetrics(req: Request, res: Response) {
  return res.json({
    metrics: {
      totalUsers: 142,
      activeWorkspaces: 18,
      totalMeetingsRecorded: 1240,
      openAiTokensUsed: 1485000,
      whisperAudioHoursProcessed: 320,
      monthlySubscriptionRevenue: 4850,
      activePlan: 'Enterprise Tier',
      aiModel: 'OpenAI GPT-4o & Whisper v1'
    },
    users: [
      { id: 'u-1', name: 'කසුන් පෙරේරා', email: 'alex.vance@meetingmind.ai', role: 'MANAGER', status: 'ACTIVE', lastActive: 'Today at 10:20 AM' },
      { id: 'u-2', name: 'සාරා ජයසිංහ', email: 'sarah.j@meetingmind.ai', role: 'EMPLOYEE', status: 'ACTIVE', lastActive: 'Yesterday' },
      { id: 'u-3', name: 'දිනුක ප්‍රනාන්දු', email: 'david.m@meetingmind.ai', role: 'EMPLOYEE', status: 'ACTIVE', lastActive: '2 days ago' },
      { id: 'u-4', name: 'ඉලේෂා වික්‍රමසිංහ', email: 'elena.r@meetingmind.ai', role: 'ADMIN', status: 'ACTIVE', lastActive: 'Today at 09:15 AM' }
    ]
  });
}
