import { Router } from 'express';
import multer from 'multer';
import { getMeetings, getMeetingById, createMeeting, deleteMeeting, transcribeAudio } from '../controllers/meetingController';
import { authMiddleware } from '../middleware/authMiddleware';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.use(authMiddleware);

router.get('/', getMeetings);
router.get('/:id', getMeetingById);
router.post('/', createMeeting);
router.delete('/:id', deleteMeeting);
router.post('/transcribe', upload.single('audio'), transcribeAudio);

export default router;
