import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import meetingRoutes from './routes/meetingRoutes';
import taskRoutes from './routes/taskRoutes';
import aiRoutes from './routes/aiRoutes';
import workspaceRoutes from './routes/workspaceRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Healthcheck
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MeetingMind Enterprise Backend API',
    timestamp: new Date().toISOString(),
    aiEngine: process.env.OPENAI_API_KEY ? 'OpenAI Live API' : 'High-Fidelity AI Fallback Engine'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/admin', adminRoutes);

export default app;
