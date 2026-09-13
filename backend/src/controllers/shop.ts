import { Response } from 'express';
import { TransactionType } from '../types/enums';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../utils/db';

export const getShopItems = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const items = await prisma.shopItem.findMany({
      orderBy: { cost: 'asc' },
    });
    res.json(items);
  } catch (error) {
    console.error('getShopItems error:', error);
    res.status(500).json({ error: 'Failed to retrieve shop items' });
  }
};

export const purchaseItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const itemId = req.params.id as string;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const shopItem = await prisma.shopItem.findUnique({
      where: { id: itemId },
    });

    if (!shopItem) {
      res.status(404).json({ error: 'Shop item not found' });
      return;
    }

    const character = await prisma.character.findUnique({
      where: { userId },
    });

    if (!character) {
      res.status(404).json({ error: 'Character profile not found' });
      return;
    }

    if (character.currencyBalance < shopItem.cost) {
      res.status(400).json({
        error: 'Insufficient currency',
        required: shopItem.cost,
        currentBalance: character.currencyBalance,
      });
      return;
    }

    // Check if item already purchased
    const existingInventory = await prisma.inventory.findFirst({
      where: {
        characterId: character.id,
        shopItemId: itemId,
      },
    });

    if (existingInventory) {
      res.status(400).json({ error: 'Item already owned in inventory' });
      return;
    }

    const purchaseResult = await prisma.$transaction(async (tx) => {
      // 1. Deduct currency
      const updatedCharacter = await tx.character.update({
        where: { id: character.id },
        data: {
          currencyBalance: {
            decrement: shopItem.cost,
          },
        },
      });

      // 2. Add to Inventory
      const inventory = await tx.inventory.create({
        data: {
          characterId: character.id,
          shopItemId: shopItem.id,
        },
        include: {
          shopItem: true,
        },
      });

      // 3. Log SPEND Transaction
      const transaction = await tx.transaction.create({
        data: {
          characterId: character.id,
          type: TransactionType.SPEND,
          amount: shopItem.cost,
          reason: `Purchased cosmetic: ${shopItem.name}`,
        },
      });

      return {
        success: true,
        newBalance: updatedCharacter.currencyBalance,
        inventory,
        transaction,
      };
    });

    res.status(201).json(purchaseResult);
  } catch (error) {
    console.error('purchaseItem error:', error);
    res.status(500).json({ error: 'Failed to process shop purchase' });
  }
};
