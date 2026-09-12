import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getTasks, createTask, updateTask, deleteTask, completeTask } from '../controllers/tasks';

const router = Router();

router.use(authenticateToken);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/complete', completeTask);

export default router;
