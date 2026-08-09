import { Router } from 'express';
import { getAdminSystemMetrics } from '../controllers/adminController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/metrics', getAdminSystemMetrics);

export default router;
