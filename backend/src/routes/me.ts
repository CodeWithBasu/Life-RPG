import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getMe, updateMe } from '../controllers/me';

const router = Router();

router.get('/', requireAuth, getMe);
router.patch('/', requireAuth, updateMe);

export default router;
