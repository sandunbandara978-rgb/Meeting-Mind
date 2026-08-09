import { Router } from 'express';
import { register, login, getCurrentUser, googleOAuth } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleOAuth);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
