import { Router } from 'express';
import { z } from 'zod';
import { TaskCategory, Difficulty } from '@prisma/client';
import { requireAuth } from '../middleware/auth';
import { validateBody, validateObjectIdParam } from '../middleware/validate';
import {
  getTasks,
  createTask,
  completeTask,
  deleteTask,
  classify,
  editTask,
} from '../controllers/tasks';

const router = Router();

router.use(requireAuth);

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(140),
  category: z.nativeEnum(TaskCategory, {
    message: 'Category must be INTELLECT, STRENGTH, DISCIPLINE, or CREATIVITY',
  }),
  difficulty: z.nativeEnum(Difficulty, {
    message: 'Difficulty must be EASY, MEDIUM, HARD, or EPIC',
  }),
  flavorText: z.string().max(200).optional(),
  icon: z.string().max(50).optional(),
  reminderTime: z.string().optional(),
});

const classifySchema = z.object({
  taskText: z.string().min(1, 'Task text cannot be empty').max(500),
});

router.get('/', getTasks);
router.post('/', validateBody(createTaskSchema), createTask);
router.patch('/:id', validateObjectIdParam('id'), editTask);
router.post('/classify', validateBody(classifySchema), classify);
router.patch('/:id/complete', validateObjectIdParam('id'), completeTask);
router.delete('/:id', validateObjectIdParam('id'), deleteTask);

export default router;
