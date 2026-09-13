import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../utils/db';

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        createdAt: true,
        character: {
          include: {
            attributes: true,
            streak: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User profile not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
};

export const updateMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { displayName, avatarUrl } = req.body;
    const dataToUpdate: any = {};
    if (typeof displayName === 'string' && displayName.trim()) {
      dataToUpdate.displayName = displayName.trim();
    }
    if (typeof avatarUrl === 'string' && avatarUrl.trim()) {
      dataToUpdate.avatarUrl = avatarUrl.trim();
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        createdAt: true,
        character: {
          include: {
            attributes: true,
            streak: true,
          },
        },
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('updateMe error:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};

