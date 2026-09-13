import { Response } from 'express';
import { TaskCategory, Difficulty, TaskStatus, TransactionType } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../utils/db';
import {
  calculateStreak,
  calculateQuestReward,
  calculateLevelProgress,
} from '../services/gameLogic';
import { generateQuestFlavor, classifyTask } from '../services/llm';

export const getTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tasks);
  } catch (error) {
    console.error('getTasks error:', error);
    res.status(500).json({ error: 'Failed to fetch user tasks' });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { title, category, difficulty, flavorText, icon } = req.body as {
      title: string;
      category: TaskCategory;
      difficulty: Difficulty;
      flavorText?: string;
      icon?: string;
    };

    // If no custom flavorText provided, attempt dark-fantasy rewrite via LLM with safe fallback
    const resolvedFlavorText = flavorText?.trim()
      ? flavorText.trim()
      : await generateQuestFlavor(title, category);

    const task = await prisma.task.create({
      data: {
        userId,
        title: title.trim(),
        icon: icon?.trim() || null,
        flavorText: resolvedFlavorText,
        category,
        difficulty,
        status: TaskStatus.ACTIVE,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('createTask error:', error);
    res.status(500).json({ error: 'Failed to create quest' });
  }
};

export const completeTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const taskId = req.params.id as string;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      res.status(404).json({ error: 'Quest not found' });
      return;
    }

    if (existingTask.userId !== userId) {
      res.status(403).json({ error: 'Forbidden: You do not own this quest' });
      return;
    }

    if (existingTask.status === TaskStatus.COMPLETED) {
      res.status(400).json({ error: 'Quest is already completed' });
      return;
    }

    const now = new Date();

    const completionResult = await prisma.$transaction(async (tx) => {
      // 1. Mark task as completed
      const updatedTask = await tx.task.update({
        where: { id: taskId },
        data: {
          status: TaskStatus.COMPLETED,
          completedAt: now,
        },
      });

      // 2. Fetch Character with relations
      const character = await tx.character.findUnique({
        where: { userId },
        include: {
          streak: true,
          attributes: true,
        },
      });

      if (!character) {
        throw new Error('Character profile not found');
      }

      // 3. Evaluate streak (server-side UTC calculation)
      const currentStreakVal = character.streak?.currentStreak ?? 0;
      const longestStreakVal = character.streak?.longestStreak ?? 0;
      const streakEval = calculateStreak(
        character.streak?.lastActivityDate,
        now,
        currentStreakVal,
        longestStreakVal
      );

      let updatedStreak;
      if (character.streak) {
        updatedStreak = await tx.streak.update({
          where: { characterId: character.id },
          data: {
            currentStreak: streakEval.currentStreak,
            longestStreak: streakEval.longestStreak,
            lastActivityDate: now,
          },
        });
      } else {
        updatedStreak = await tx.streak.create({
          data: {
            characterId: character.id,
            currentStreak: streakEval.currentStreak,
            longestStreak: streakEval.longestStreak,
            lastActivityDate: now,
          },
        });
      }

      // 4. Calculate XP and Currency rewards with streak bonus
      const { xpEarned, currencyEarned, bonusMultiplier } = calculateQuestReward(
        existingTask.difficulty,
        streakEval.currentStreak
      );

      // 5. Calculate level-up progression
      const levelProgression = calculateLevelProgress(
        character.level,
        character.currentXp,
        xpEarned
      );

      // 6. Update Character state
      const updatedCharacter = await tx.character.update({
        where: { id: character.id },
        data: {
          level: levelProgression.newLevel,
          currentXp: levelProgression.newXp,
          currencyBalance: character.currencyBalance + currencyEarned,
        },
      });

      // 7. Update matching Attribute value
      const existingAttribute = character.attributes.find(
        (attr) => attr.name === existingTask.category
      );

      let updatedAttribute;
      if (existingAttribute) {
        updatedAttribute = await tx.attribute.update({
          where: { id: existingAttribute.id },
          data: {
            value: existingAttribute.value + xpEarned,
          },
        });
      } else {
        updatedAttribute = await tx.attribute.create({
          data: {
            characterId: character.id,
            name: existingTask.category,
            value: xpEarned,
          },
        });
      }

      // 8. Record Transaction ledger entry
      const transaction = await tx.transaction.create({
        data: {
          characterId: character.id,
          type: TransactionType.EARN,
          amount: currencyEarned,
          reason: `Quest Completed: ${existingTask.title}`,
        },
      });

      return {
        task: updatedTask,
        character: updatedCharacter,
        attribute: updatedAttribute,
        streak: updatedStreak,
        transaction,
        reward: {
          xpEarned,
          currencyEarned,
          bonusMultiplier,
        },
        leveledUp: levelProgression.leveledUp,
        newLevel: levelProgression.newLevel,
      };
    });

    res.json(completionResult);
  } catch (error: any) {
    console.error('completeTask error:', error);
    if (error?.message === 'Character profile not found') {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Failed to complete quest' });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const taskId = req.params.id as string;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      res.status(404).json({ error: 'Quest not found' });
      return;
    }

    if (existingTask.userId !== userId) {
      res.status(403).json({ error: 'Forbidden: You do not own this quest' });
      return;
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({ success: true, message: 'Quest deleted successfully' });
  } catch (error) {
    console.error('deleteTask error:', error);
    res.status(500).json({ error: 'Failed to delete quest' });
  }
};

export const classify = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { taskText } = req.body;
    const result = await classifyTask(taskText);
    res.json(result);
  } catch (error) {
    console.error('classify error:', error);
    res.status(500).json({ error: 'Failed to classify task' });
  }
};
