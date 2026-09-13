import { Response } from 'express';
import { TaskCategory } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../utils/db';
import {
  chatWithMentor,
  generateWeeklyChronicle,
  generateQuestFlavor,
  PlayerStatsSummary,
  WeeklyActivitySummary,
} from '../services/llm';

export const mentorChatHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { message, history } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const character = await prisma.character.findUnique({
      where: { userId },
      include: {
        attributes: true,
        streak: true,
      },
    });

    if (!character) {
      res.status(404).json({ error: 'Character profile not found' });
      return;
    }

    // Determine 7-day neglected attribute from completed tasks
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentTasks = await prisma.task.findMany({
      where: {
        userId,
        status: 'COMPLETED',
      },
    });

    const counts: Record<string, number> = {
      INTELLECT: 0,
      STRENGTH: 0,
      DISCIPLINE: 0,
      CREATIVITY: 0,
    };

    for (const task of recentTasks) {
      const cat = String(task.category || 'DISCIPLINE');
      counts[cat] = (counts[cat] || 0) + 1;
    }

    let minCat = 'DISCIPLINE';
    let minCount = Infinity;
    for (const [cat, count] of Object.entries(counts)) {
      if (count < minCount) {
        minCount = count;
        minCat = cat;
      }
    }

    const attrs = character.attributes || [];
    const intellect = attrs.find((a) => a.name === 'INTELLECT')?.value ?? 0;
    const strength = attrs.find((a) => a.name === 'STRENGTH')?.value ?? 0;
    const discipline = attrs.find((a) => a.name === 'DISCIPLINE')?.value ?? 0;
    const creativity = attrs.find((a) => a.name === 'CREATIVITY')?.value ?? 0;

    const summary: PlayerStatsSummary = {
      level: character.level,
      streakDays: character.streak?.currentStreak ?? 0,
      intellect,
      strength,
      discipline,
      creativity,
      neglectedAttribute: minCat,
    };

    const reply = await chatWithMentor(summary, message || 'Greetings, Sage.', history || '');
    res.json({ reply, stats: summary });
  } catch (error) {
    console.error('mentorChatHandler error:', error);
    res.status(500).json({ error: 'Failed to consult mentor' });
  }
};

export const weeklyChronicleHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const character = await prisma.character.findUnique({
      where: { userId },
      include: { streak: true },
    });

    if (!character) {
      res.status(404).json({ error: 'Character profile not found' });
      return;
    }

    const allCompleted = await prisma.task.findMany({
      where: { userId, status: 'COMPLETED' },
    });

    const categoryBreakdown =
      allCompleted.length > 0
        ? allCompleted
            .map((t) => t.category)
            .reduce((acc: any, cat) => {
              acc[cat] = (acc[cat] || 0) + 1;
              return acc;
            }, {})
        : { DISCIPLINE: 1 };

    const breakdownStr = Object.entries(categoryBreakdown)
      .map(([cat, count]) => `${cat}: ${count}`)
      .join(', ');

    const summary: WeeklyActivitySummary = {
      questCount: allCompleted.length,
      categoryBreakdown: breakdownStr || 'Discipline: 1',
      streakDays: character.streak?.currentStreak ?? 1,
      streakBroken: false,
      startLevel: Math.max(1, character.level - 1),
      endLevel: character.level,
    };

    const chronicle = await generateWeeklyChronicle(summary);
    res.json({ chronicle, summary });
  } catch (error) {
    console.error('weeklyChronicleHandler error:', error);
    res.status(500).json({ error: 'Failed to write chronicle' });
  }
};

export const flavorHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { taskText, category } = req.body;
    const cat = category || TaskCategory.DISCIPLINE;
    const flavorText = await generateQuestFlavor(taskText || '', cat);
    res.json({ flavorText });
  } catch (error) {
    console.error('flavorHandler error:', error);
    res.status(500).json({ error: 'Failed to generate flavor' });
  }
};
