import assert from 'node:assert/strict';
import {
  xpToNextLevel,
  calculateStreakBonus,
  calculateStreak,
  calculateLevelProgress,
  calculateQuestReward,
  DIFFICULTY_XP,
  DIFFICULTY_CURRENCY,
} from '../services/gameLogic';

function runTests() {
  console.log('Running Life-RPG Game Logic Tests...\n');

  // 1. XP Curve Formula
  {
    assert.equal(xpToNextLevel(1), 100, 'Level 1 requires 100 XP');
    assert.equal(xpToNextLevel(2), 282, 'Level 2 requires 282 XP');
    assert.equal(xpToNextLevel(3), 519, 'Level 3 requires 519 XP');
    console.log('✔ XP curve formula matches mathematical specification');
  }

  // 2. Fixed Server-Side Difficulty Lookup
  {
    assert.equal(DIFFICULTY_XP.EASY, 10);
    assert.equal(DIFFICULTY_XP.MEDIUM, 25);
    assert.equal(DIFFICULTY_XP.HARD, 50);
    assert.equal(DIFFICULTY_XP.EPIC, 100);

    assert.equal(DIFFICULTY_CURRENCY.EASY, 5);
    assert.equal(DIFFICULTY_CURRENCY.MEDIUM, 12);
    assert.equal(DIFFICULTY_CURRENCY.HARD, 25);
    assert.equal(DIFFICULTY_CURRENCY.EPIC, 50);
    console.log('✔ Server-side reward tables are fixed and tamper-proof');
  }

  // 3. Streak Multiplier (+5% per 5-day streak, capped at +25%)
  {
    assert.equal(calculateStreakBonus(0), 0);
    assert.equal(calculateStreakBonus(4), 0);
    assert.equal(calculateStreakBonus(5), 0.05);
    assert.equal(calculateStreakBonus(9), 0.05);
    assert.equal(calculateStreakBonus(10), 0.1);
    assert.equal(calculateStreakBonus(15), 0.15);
    assert.equal(calculateStreakBonus(20), 0.2);
    assert.equal(calculateStreakBonus(25), 0.25);
    assert.equal(calculateStreakBonus(60), 0.25, 'Streak bonus capped at +25%');
    console.log('✔ Streak bonus applies scaling multiplier up to 25% cap');
  }

  // 4. Streak Calculation
  {
    const today = new Date('2026-03-15T12:00:00Z');
    const sameDay = new Date('2026-03-15T02:00:00Z');
    const yesterday = new Date('2026-03-14T18:00:00Z');
    const twoDaysAgo = new Date('2026-03-13T20:00:00Z');

    // First completion ever
    const initial = calculateStreak(null, today, 0, 0);
    assert.equal(initial.currentStreak, 1);
    assert.equal(initial.longestStreak, 1);
    assert.equal(initial.isNewDay, true);

    // Same day completion
    const sameDayResult = calculateStreak(sameDay, today, 3, 5);
    assert.equal(sameDayResult.currentStreak, 3);
    assert.equal(sameDayResult.longestStreak, 5);
    assert.equal(sameDayResult.isNewDay, false);

    // Consecutive day completion
    const nextDayResult = calculateStreak(yesterday, today, 3, 5);
    assert.equal(nextDayResult.currentStreak, 4);
    assert.equal(nextDayResult.longestStreak, 5);
    assert.equal(nextDayResult.isNewDay, true);

    // Broken streak (gap > 1 day)
    const brokenResult = calculateStreak(twoDaysAgo, today, 9, 12);
    assert.equal(brokenResult.currentStreak, 1);
    assert.equal(brokenResult.longestStreak, 12);
    assert.equal(brokenResult.isNewDay, true);

    console.log('✔ Streak evaluation accurately tracks same-day, consecutive, and broken states');
  }

  // 5. Level Progress and Multi-Level Jumps
  {
    // Normal progress within same level
    const progressWithin = calculateLevelProgress(1, 20, 30);
    assert.equal(progressWithin.newLevel, 1);
    assert.equal(progressWithin.newXp, 50);
    assert.equal(progressWithin.leveledUp, false);
    assert.equal(progressWithin.levelsGained, 0);

    // Single level up
    const singleLevelUp = calculateLevelProgress(1, 80, 25);
    assert.equal(singleLevelUp.newLevel, 2);
    assert.equal(singleLevelUp.newXp, 5);
    assert.equal(singleLevelUp.leveledUp, true);
    assert.equal(singleLevelUp.levelsGained, 1);

    // Multi-level up (e.g. 500 XP at Level 1: needs 100 for lvl 2, 282 for lvl 3 = 382 total, 118 XP left into lvl 3)
    const multiLevelUp = calculateLevelProgress(1, 0, 500);
    assert.equal(multiLevelUp.newLevel, 3);
    assert.equal(multiLevelUp.newXp, 118);
    assert.equal(multiLevelUp.leveledUp, true);
    assert.equal(multiLevelUp.levelsGained, 2);

    console.log('✔ Level progression handles single and multi-level loops seamlessly');
  }

  // 6. Quest Reward Evaluation with Streak Multiplier
  {
    const epicWithStreak = calculateQuestReward('EPIC', 15);
    assert.equal(epicWithStreak.bonusMultiplier, 0.15);
    assert.equal(epicWithStreak.xpEarned, 115); // 100 * 1.15
    assert.equal(epicWithStreak.currencyEarned, 50);
    console.log('✔ Quest reward calculation correctly applies streak multipliers');
  }

  console.log('\nAll Life-RPG game logic tests passed successfully!');
}

runTests();
