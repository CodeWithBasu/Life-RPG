import { Difficulty } from '../types/enums';

export const DIFFICULTY_XP: Record<Difficulty, number> = {
  EASY: 10,
  MEDIUM: 25,
  HARD: 50,
  EPIC: 100,
};

export const DIFFICULTY_CURRENCY: Record<Difficulty, number> = {
  EASY: 5,
  MEDIUM: 12,
  HARD: 25,
  EPIC: 50,
};

export const xpToNextLevel = (level: number): number => {
  if (level < 1) return 100;
  return Math.floor(100 * Math.pow(level, 1.5));
};

export const calculateStreakBonus = (streakDays: number): number => {
  if (streakDays < 5) return 0;
  const tiers = Math.floor(streakDays / 5);
  return Math.min(0.25, Number((tiers * 0.05).toFixed(2)));
};

export interface StreakEvaluation {
  currentStreak: number;
  longestStreak: number;
  isNewDay: boolean;
  daysDiff: number;
}

const getUtcDayTimestamp = (date: Date): number => {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

export const calculateStreak = (
  lastActivityDate: Date | null | undefined,
  currentDate: Date = new Date(),
  currentStreak = 0,
  longestStreak = 0
): StreakEvaluation => {
  const currentDay = getUtcDayTimestamp(currentDate);

  if (!lastActivityDate) {
    const nextStreak = 1;
    return {
      currentStreak: nextStreak,
      longestStreak: Math.max(longestStreak, nextStreak),
      isNewDay: true,
      daysDiff: -1,
    };
  }

  const lastDay = getUtcDayTimestamp(new Date(lastActivityDate));
  const diffDays = Math.floor((currentDay - lastDay) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return {
      currentStreak,
      longestStreak,
      isNewDay: false,
      daysDiff: 0,
    };
  }

  if (diffDays === 1) {
    const nextStreak = currentStreak + 1;
    return {
      currentStreak: nextStreak,
      longestStreak: Math.max(longestStreak, nextStreak),
      isNewDay: true,
      daysDiff: 1,
    };
  }

  const resetStreak = 1;
  return {
    currentStreak: resetStreak,
    longestStreak: Math.max(longestStreak, resetStreak),
    isNewDay: true,
    daysDiff: diffDays,
  };
};

export interface LevelProgress {
  newLevel: number;
  newXp: number;
  leveledUp: boolean;
  levelsGained: number;
}

export const calculateLevelProgress = (
  initialLevel: number,
  initialXp: number,
  xpEarned: number
): LevelProgress => {
  let level = Math.max(1, initialLevel);
  let xp = Math.max(0, initialXp) + Math.max(0, xpEarned);
  const startingLevel = level;

  while (true) {
    const needed = xpToNextLevel(level);
    if (xp >= needed) {
      xp -= needed;
      level += 1;
    } else {
      break;
    }
  }

  return {
    newLevel: level,
    newXp: xp,
    leveledUp: level > startingLevel,
    levelsGained: level - startingLevel,
  };
};

export const calculateQuestReward = (
  difficulty: Difficulty | string,
  streakDays: number
): { xpEarned: number; currencyEarned: number; bonusMultiplier: number } => {
  const normalizedDiff = (difficulty as Difficulty) in DIFFICULTY_XP ? (difficulty as Difficulty) : Difficulty.EASY;
  const baseHp = DIFFICULTY_XP[normalizedDiff] ?? 10;
  const currencyEarned = DIFFICULTY_CURRENCY[normalizedDiff] ?? 5;
  const bonusMultiplier = calculateStreakBonus(streakDays);
  const xpEarned = Math.round(baseHp * (1 + bonusMultiplier));

  return {
    xpEarned,
    currencyEarned,
    bonusMultiplier,
  };
};
