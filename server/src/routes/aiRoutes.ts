import { Router } from 'express';
import { askMeetingAi, summarizeRawText } from '../controllers/aiController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.post('/chat', askMeetingAi);
router.post('/summarize', summarizeRawText);

export default router;
