import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  mentorChatHandler,
  weeklyChronicleHandler,
  flavorHandler,
} from '../controllers/ai';

const router = Router();

router.use(requireAuth);

router.post('/mentor', mentorChatHandler);
router.get('/chronicle', weeklyChronicleHandler);
router.post('/flavor', flavorHandler);

export default router;
