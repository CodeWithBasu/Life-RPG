import { Router } from 'express';
import { signup, login, getMe } from '../controllers/auth';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticateToken, getMe as any);

export default router;
