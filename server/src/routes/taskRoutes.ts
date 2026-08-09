import { Router } from 'express';
import { getTasks, createTask, updateTaskStatus, deleteTask } from '../controllers/taskController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;
