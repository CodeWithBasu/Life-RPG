import { TaskCategory, Difficulty } from '@prisma/client';

const TIMEOUT_MS = 6000;

interface ClassificationResult {
  category: TaskCategory;
  difficulty: Difficulty;
}

export interface PlayerStatsSummary {
  level: number;
  streakDays: number;
  intellect: number;
  strength: number;
  discipline: number;
  creativity: number;
  neglectedAttribute: string;
}

export interface WeeklyActivitySummary {
  questCount: number;
  categoryBreakdown: string;
  streakDays: number;
  streakBroken: boolean;
  startLevel: number;
  endLevel: number;
}

const CATEGORY_MAP: Record<string, TaskCategory> = {
  intellect: 'INTELLECT',
  intelligence: 'INTELLECT',
  mental: 'INTELLECT',
  study: 'INTELLECT',
  strength: 'STRENGTH',
  physical: 'STRENGTH',
  fitness: 'STRENGTH',
  discipline: 'DISCIPLINE',
  routine: 'DISCIPLINE',
  focus: 'DISCIPLINE',
  creativity: 'CREATIVITY',
  creative: 'CREATIVITY',
  art: 'CREATIVITY',
};

const DIFFICULTY_MAP: Record<string, Difficulty> = {
  easy: 'EASY',
  medium: 'MEDIUM',
  hard: 'HARD',
  epic: 'EPIC',
};

const parseJsonSafely = (raw: string): any => {
  const cleaned = raw
    .replace(/^```(?:json)?/im, '')
    .replace(/```$/im, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    }
    throw new Error('Malformed JSON');
  }
};

async function callChatModel(systemPrompt: string, userPrompt: string): Promise<string> {
  const mistralKey = process.env.MISTRAL_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!mistralKey && !anthropicKey) {
    throw new Error('No LLM API key configured');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Priority: Mistral (free tier support)
    if (mistralKey) {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mistralKey.trim()}`,
        },
        body: JSON.stringify({
          model: process.env.MISTRAL_MODEL || 'mistral-small-latest',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 250,
          temperature: 0.3,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data?.choices?.[0]?.message?.content?.trim() || '';
    }

    // Anthropic fallback
    if (anthropicKey) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey.trim(),
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
          max_tokens: 250,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      const textBlock = data?.content?.find((c: any) => c.type === 'text');
      return textBlock?.text?.trim() || '';
    }

    return '';
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function classifyTask(taskText: string): Promise<ClassificationResult> {
  const fallback: ClassificationResult = {
    category: 'DISCIPLINE',
    difficulty: 'EASY',
  };

  if (!taskText || typeof taskText !== 'string') {
    return fallback;
  }

  const systemPrompt = `You are a game logic engine for an RPG habit-tracking app. Given a task description, classify it. Respond with ONLY valid JSON, no markdown fences, no explanation.
Schema:
{
  "category": "Intellect" | "Strength" | "Discipline" | "Creativity",
  "difficulty": "Easy" | "Medium" | "Hard" | "Epic"
}`;

  const userPrompt = `Task: "${taskText.slice(0, 300)}"`;

  try {
    const rawOutput = await callChatModel(systemPrompt, userPrompt);
    const parsed = parseJsonSafely(rawOutput);

    const parsedCat = String(parsed?.category || '').toLowerCase().trim();
    const parsedDiff = String(parsed?.difficulty || '').toLowerCase().trim();

    const category = CATEGORY_MAP[parsedCat] || 'DISCIPLINE';
    const difficulty = DIFFICULTY_MAP[parsedDiff] || 'EASY';

    return { category, difficulty };
  } catch {
    return fallback;
  }
}

export async function generateQuestFlavor(taskText: string, category: TaskCategory): Promise<string> {
  const sanitizedOriginal = taskText?.trim() || 'Hero Quest';

  const systemPrompt = `You are a narrator for a dark-fantasy RPG. Rewrite the given mundane task as a one-line quest title in that voice. Keep it under 12 words. Respond with ONLY the rewritten line, nothing else — no quotes, no explanation.`;
  const userPrompt = `Task: "${sanitizedOriginal.slice(0, 200)}"\nCategory: ${category}`;

  try {
    const rawOutput = await callChatModel(systemPrompt, userPrompt);
    const cleaned = rawOutput
      .replace(/["“”'']/g, '')
      .replace(/\r?\n.*/s, '')
      .trim();

    if (cleaned.length > 0 && cleaned.length <= 150) {
      return cleaned;
    }
    return sanitizedOriginal;
  } catch {
    return sanitizedOriginal;
  }
}

export async function chatWithMentor(
  stats: PlayerStatsSummary,
  userMessage: string,
  chatHistory = ''
): Promise<string> {
  const systemPrompt = `You are Sage, a wise in-game companion in a dark-fantasy RPG habit tracker. Speak in 1-2 short sentences, warm but slightly archaic tone. Reference the player's real stats when relevant. Never break character, never mention being an AI. Respond with plain text only.`;

  const userPrompt = `Player state:
- Level: ${stats.level}
- Streak: ${stats.streakDays} days
- Attributes: Intellect ${stats.intellect}, Strength ${stats.strength}, Discipline ${stats.discipline}, Creativity ${stats.creativity}
- Least-used attribute in last 7 days: ${stats.neglectedAttribute}

Conversation so far:
${chatHistory || 'None'}

Player just said: "${userMessage}"`;

  try {
    const reply = await callChatModel(systemPrompt, userPrompt);
    if (reply) return reply;
  } catch {
    // Graceful fallback
  }

  // Atmospheric in-character fallback
  if (userMessage.toLowerCase().includes('tired') || userMessage.toLowerCase().includes('hard')) {
    return `Even legendary champions must rest their blades, hero of Level ${stats.level}. Protect thy ${stats.streakDays}-day streak with a humble step today.`;
  }
  return `Thy flame burns at Level ${stats.level}, adventurer. Hone thy ${stats.neglectedAttribute} this eve, and let thy ${stats.streakDays}-day momentum guide thy path.`;
}

export async function generateWeeklyChronicle(summary: WeeklyActivitySummary): Promise<string> {
  const systemPrompt = `You are a chronicler writing a short in-universe journal entry summarizing a hero's week. 2-3 sentences, dark-fantasy tone. Base it only on the data given — do not invent events not listed. Respond with plain text only.`;

  const userPrompt = `This week's activity:
- Quests completed: ${summary.questCount}
- Categories worked: ${summary.categoryBreakdown}
- Streak status: ${summary.streakDays} days, ${summary.streakBroken ? 'broken this week' : 'unbroken'}
- Level change: ${summary.startLevel} → ${summary.endLevel}`;

  try {
    const chronicle = await callChatModel(systemPrompt, userPrompt);
    if (chronicle) return chronicle;
  } catch {
    // Fallback
  }

  return `The grand archives record ${summary.questCount} quests conquered across ${summary.categoryBreakdown}. Thy resolve holds unbroken across ${summary.streakDays} days, advancing thy legend to Level ${summary.endLevel}.`;
}
