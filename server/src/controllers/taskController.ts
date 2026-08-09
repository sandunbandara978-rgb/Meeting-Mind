import { Request, Response } from 'express';

let SAMPLE_TASKS = [
  { id: 'task-1', title: 'Draft GraphQL API Migration Guide for dev team', description: 'Create comprehensive guidelines and code examples.', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-07-28', assigneeName: 'දිනුක ප්‍රනාන්දු', meetingTitle: 'Q3 Product Architecture & API Alignment' },
  { id: 'task-2', title: 'Configure AWS KMS Envelope Encryption', description: 'Set up encryption keys and update S3 upload pipeline.', status: 'TODO', priority: 'URGENT', dueDate: '2026-07-25', assigneeName: 'ඉලේෂා වික්‍රමසිංහ', meetingTitle: 'Q3 Product Architecture & API Alignment' },
  { id: 'task-3', title: 'Publish Q3 Security & Architecture roadmap update', description: 'Notify engineering leads and product managers.', status: 'DONE', priority: 'MEDIUM', dueDate: '2026-07-30', assigneeName: 'කසුන් පෙරේරා', meetingTitle: 'Q3 Product Architecture & API Alignment' },
  { id: 'task-4', title: 'Finalize product walkthrough video production', description: 'Produce HD demo video for landing page and YouTube.', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-07-26', assigneeName: 'මාලක සංජය', meetingTitle: 'Marketing Campaign & Product Launch Sync' },
  { id: 'task-5', title: 'Launch LinkedIn Developer Ad Campaign', description: 'Set up ad targeting for software engineers and engineering managers.', status: 'TODO', priority: 'MEDIUM', dueDate: '2026-08-01', assigneeName: 'යසෝධා තිලකරත්න', meetingTitle: 'Marketing Campaign & Product Launch Sync' }
];

export async function getTasks(req: Request, res: Response) {
  return res.json({ tasks: SAMPLE_TASKS });
}

export async function createTask(req: Request, res: Response) {
  const { title, description, status, priority, dueDate, assigneeName, meetingTitle } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const newTask = {
    id: `task-${Date.now()}`,
    title,
    description: description || '',
    status: status || 'TODO',
    priority: priority || 'MEDIUM',
    dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    assigneeName: assigneeName || 'Unassigned',
    meetingTitle: meetingTitle || 'Direct Task'
  };

  SAMPLE_TASKS.unshift(newTask);
  return res.status(201).json({ task: newTask });
}

export async function updateTaskStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status, priority, title, assigneeName } = req.body;

  const taskIndex = SAMPLE_TASKS.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  SAMPLE_TASKS[taskIndex] = {
    ...SAMPLE_TASKS[taskIndex],
    ...(status && { status }),
    ...(priority && { priority }),
    ...(title && { title }),
    ...(assigneeName && { assigneeName })
  };

  return res.json({ task: SAMPLE_TASKS[taskIndex] });
}

export async function deleteTask(req: Request, res: Response) {
  const { id } = req.params;
  SAMPLE_TASKS = SAMPLE_TASKS.filter(t => t.id !== id);
  return res.json({ success: true, message: 'Task deleted successfully' });
}
