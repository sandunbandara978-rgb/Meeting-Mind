import { Router } from 'express';
import { getWorkspaces, createWorkspace, addTeamMember } from '../controllers/workspaceController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getWorkspaces);
router.post('/', createWorkspace);
router.post('/:workspaceId/members', addTeamMember);

export default router;
