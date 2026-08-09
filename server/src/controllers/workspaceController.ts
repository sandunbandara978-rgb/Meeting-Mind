import { Request, Response } from 'express';

let WORKSPACES = [
  {
    id: 'ws-acme',
    name: 'Acme Corp Engineering',
    ownerId: 'demo-user-123',
    teams: [
      { id: 'team-backend', name: 'Core Backend Team' },
      { id: 'team-[frontend]', name: 'Frontend & UI Team' },
      { id: 'team-sec', name: 'Security & DevOps' }
    ],
    members: [
      { id: 'm-1', name: 'කසුන් පෙරේරා', role: 'MANAGER', email: 'alex.vance@meetingmind.ai' },
      { id: 'm-2', name: 'සාරා ජයසිංහ', role: 'EMPLOYEE', email: 'sarah.j@meetingmind.ai' },
      { id: 'm-3', name: 'දිනුක ප්‍රනාන්දු', role: 'EMPLOYEE', email: 'david.m@meetingmind.ai' },
      { id: 'm-4', name: 'ඉලේෂා වික්‍රමසිංහ', role: 'ADMIN', email: 'elena.r@meetingmind.ai' }
    ]
  },
  {
    id: 'ws-growth',
    name: 'Product Growth & Marketing',
    ownerId: 'demo-user-123',
    teams: [
      { id: 'team-mkt', name: 'Performance Marketing' },
      { id: 'team-design', name: 'Brand & Creative Design' }
    ],
    members: [
      { id: 'm-1', name: 'කසුන් පෙරේරා', role: 'MANAGER', email: 'alex.vance@meetingmind.ai' },
      { id: 'm-5', name: 'මාලක සංජය', role: 'EMPLOYEE', email: 'marcus.w@meetingmind.ai' },
      { id: 'm-6', name: 'යසෝධා තිලකරත්න', role: 'EMPLOYEE', email: 'jessica.t@meetingmind.ai' }
    ]
  }
];

export async function getWorkspaces(req: Request, res: Response) {
  return res.json({ workspaces: WORKSPACES });
}

export async function createWorkspace(req: Request, res: Response) {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Workspace name is required' });

  const newWs = {
    id: `ws-${Date.now()}`,
    name,
    ownerId: 'demo-user-123',
    teams: [{ id: `team-${Date.now()}`, name: 'General Team' }],
    members: [{ id: 'm-1', name: 'කසුන් පෙරේරා', role: 'ADMIN', email: 'alex.vance@meetingmind.ai' }]
  };

  WORKSPACES.unshift(newWs);
  return res.status(201).json({ workspace: newWs });
}

export async function addTeamMember(req: Request, res: Response) {
  const { workspaceId } = req.params;
  const { name, email, role } = req.body;

  const ws = WORKSPACES.find(w => w.id === workspaceId);
  if (!ws) return res.status(404).json({ error: 'Workspace not found' });

  const newMember = {
    id: `m-${Date.now()}`,
    name: name || email.split('@')[0],
    email,
    role: role || 'EMPLOYEE'
  };

  ws.members.push(newMember);
  return res.status(201).json({ member: newMember, workspace: ws });
}
