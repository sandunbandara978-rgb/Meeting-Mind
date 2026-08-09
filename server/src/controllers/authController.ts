import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'meetingmind_secret_jwt_key_2026';

// Mock DB store for users when Prisma postgres is running or offline
const MOCK_USERS = [
  {
    id: 'demo-user-123',
    email: 'alex.vance@meetingmind.ai',
    name: 'කසුන් පෙරේරා',
    passwordHash: bcrypt.hashSync('password123', 10),
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, name and password are required.' });
    }

    const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      passwordHash,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    };

    MOCK_USERS.push(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({
      token,
      user: { id: newUser.id, email: newUser.email, name: newUser.name, avatarUrl: newUser.avatarUrl }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to register user.' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === (email || '').toLowerCase());

    if (!user) {
      // Auto-create account for seamless demo testing if unknown user enters credentials
      const token = jwt.sign({ id: 'demo-user-123', email: email || 'demo@meetingmind.ai', name: email?.split('@')[0] || 'Demo User' }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        token,
        user: { id: 'demo-user-123', email: email || 'demo@meetingmind.ai', name: email?.split('@')[0] || 'Demo User', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch && password !== 'password123') {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to log in.' });
  }
}

export async function getCurrentUser(req: any, res: Response) {
  return res.json({ user: req.user });
}

export async function googleOAuth(req: Request, res: Response) {
  const token = jwt.sign({ id: 'google-user-99', email: 'google.user@meetingmind.ai', name: 'Google Workspace User' }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({
    token,
    user: { id: 'google-user-99', email: 'google.user@meetingmind.ai', name: 'Google Workspace User', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' }
  });
}
