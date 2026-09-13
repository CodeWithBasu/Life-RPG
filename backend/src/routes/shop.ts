import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateObjectIdParam } from '../middleware/validate';
import { getShopItems, purchaseItem } from '../controllers/shop';

const router = Router();

router.get('/', getShopItems);
router.post('/:id/purchase', requireAuth, validateObjectIdParam('id'), purchaseItem);

export default router;
