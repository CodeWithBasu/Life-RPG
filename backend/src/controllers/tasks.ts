import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/db';

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, category, difficulty } = req.body;
    
    if (!title || !category) {
      res.status(400).json({ error: 'Title and category are required' });
      return;
    }

    const task = await prisma.task.create({
      data: {
        userId: req.userId!,
        title,
        category,
        difficulty: difficulty || 'EASY'
      }
    });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, category, difficulty, status } = req.body;

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    if (existingTask.userId !== req.userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const task = await prisma.task.update({
      where: { id },
      data: { title, category, difficulty, status }
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    if (existingTask.userId !== req.userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    await prisma.task.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const completeTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({ where: { id } });
      if (!task) {
        throw new Error('Task not found');
      }
      if (task.userId !== req.userId) {
        throw new Error('Unauthorized');
      }
      if (task.status === 'COMPLETED') {
        throw new Error('Task already completed');
      }

      // 1. Mark task as completed
      const updatedTask = await tx.task.update({
        where: { id },
        data: { 
          status: 'COMPLETED',
          completedAt: new Date()
        }
      });

      // 2. Calculate XP
      let earnedXp = 10;
      if (task.difficulty === 'MEDIUM') earnedXp = 20;
      if (task.difficulty === 'HARD') earnedXp = 30;

      // 3. Update Character (XP & Level)
      const character = await tx.character.findUnique({ where: { userId: req.userId } });
      if (!character) {
        throw new Error('Character not found');
      }

      let { level, currentXp, xpToNextLevel } = character;
      currentXp += earnedXp;

      while (currentXp >= xpToNextLevel) {
        currentXp -= xpToNextLevel;
        level += 1;
        xpToNextLevel = Math.floor(100 * Math.pow(level, 1.5));
      }

      const updatedCharacter = await tx.character.update({
        where: { id: character.id },
        data: { level, currentXp, xpToNextLevel }
      });

      // 4. Update Attribute
      const attribute = await tx.attribute.findFirst({
        where: { characterId: character.id, name: task.category }
      });

      if (attribute) {
        await tx.attribute.update({
          where: { id: attribute.id },
          data: { value: attribute.value + 1 }
        });
      } else {
        await tx.attribute.create({
          data: {
            characterId: character.id,
            name: task.category,
            value: 1
          }
        });
      }

      // 5. Update Streak
      let streak = await tx.streak.findUnique({ where: { characterId: character.id } });
      if (!streak) {
        streak = await tx.streak.create({
          data: {
            characterId: character.id,
            currentStreak: 0,
            longestStreak: 0
          }
        });
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let { currentStreak, longestStreak } = streak;

      if (streak.lastActivityDate) {
        const lastActivity = new Date(streak.lastActivityDate);
        const lastActivityDay = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
        
        const diffTime = Math.abs(today.getTime() - lastActivityDay.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak += 1;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else if (diffDays > 1) {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
        longestStreak = 1;
      }

      const updatedStreak = await tx.streak.update({
        where: { id: streak.id },
        data: {
          currentStreak,
          longestStreak,
          lastActivityDate: now
        }
      });

      return { task: updatedTask, character: updatedCharacter, streak: updatedStreak };
    });

    res.json(result);
  } catch (error: any) {
    if (error.message === 'Task not found') {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'Unauthorized') {
      res.status(403).json({ error: error.message });
    } else if (error.message === 'Task already completed' || error.message === 'Character not found') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to complete task' });
    }
  }
};
