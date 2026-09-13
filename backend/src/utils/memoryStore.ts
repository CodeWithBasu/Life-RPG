import { TaskCategory, Difficulty, TaskStatus, TransactionType, ShopItemType } from '../types/enums';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

function genObjectId(): string {
  return crypto.randomBytes(12).toString('hex');
}

export interface InMemoryDb {
  users: any[];
  characters: any[];
  attributes: any[];
  tasks: any[];
  streaks: any[];
  transactions: any[];
  shopItems: any[];
  inventories: any[];
}

const defaultUserId = genObjectId();
const defaultCharId = genObjectId();

const db: InMemoryDb = {
  users: [
    {
      id: defaultUserId,
      email: 'hero@liferpg.com',
      passwordHash: bcrypt.hashSync('hero123', 10),
      displayName: 'Basudev',
      avatarUrl: '/avatars/paladin.jpg',
      createdAt: new Date(),
    },
  ],
  characters: [
    {
      id: defaultCharId,
      userId: defaultUserId,
      level: 12,
      currentXp: 320,
      currencyBalance: 1240,
    },
  ],
  attributes: [
    {
      id: genObjectId(),
      characterId: defaultCharId,
      name: TaskCategory.DISCIPLINE,
      value: 24,
    },
    {
      id: genObjectId(),
      characterId: defaultCharId,
      name: TaskCategory.STRENGTH,
      value: 18,
    },
    {
      id: genObjectId(),
      characterId: defaultCharId,
      name: TaskCategory.INTELLECT,
      value: 30,
    },
    {
      id: genObjectId(),
      characterId: defaultCharId,
      name: TaskCategory.CREATIVITY,
      value: 15,
    },
  ],
  streaks: [
    {
      id: genObjectId(),
      characterId: defaultCharId,
      currentStreak: 5,
      longestStreak: 12,
      lastActivityDate: new Date(),
    },
  ],
  tasks: [
    {
      id: genObjectId(),
      userId: defaultUserId,
      title: 'Morning Routine',
      icon: '☀️',
      flavorText: 'Set the tone for a legendary day.',
      category: TaskCategory.DISCIPLINE,
      difficulty: Difficulty.MEDIUM,
      status: TaskStatus.ACTIVE,
      createdAt: new Date(Date.now() - 3600000),
      completedAt: null,
    },
    {
      id: genObjectId(),
      userId: defaultUserId,
      title: 'Study Something New',
      icon: '📚',
      flavorText: 'A sharper mind, a brighter you.',
      category: TaskCategory.INTELLECT,
      difficulty: Difficulty.HARD,
      status: TaskStatus.COMPLETED,
      createdAt: new Date(Date.now() - 14400000),
      completedAt: new Date(Date.now() - 7200000),
    },
    {
      id: genObjectId(),
      userId: defaultUserId,
      title: 'Morning Pushups & Stretch',
      icon: '⚔️',
      flavorText: 'Awaken the warrior within.',
      category: TaskCategory.STRENGTH,
      difficulty: Difficulty.MEDIUM,
      status: TaskStatus.COMPLETED,
      createdAt: new Date(Date.now() - 21600000),
      completedAt: new Date(Date.now() - 18000000),
    },
    {
      id: genObjectId(),
      userId: defaultUserId,
      title: 'Move Your Body',
      icon: '🏃',
      flavorText: 'Stronger today. Further tomorrow.',
      category: TaskCategory.STRENGTH,
      difficulty: Difficulty.MEDIUM,
      status: TaskStatus.ACTIVE,
      createdAt: new Date(Date.now() - 1800000),
      completedAt: null,
    },
    {
      id: genObjectId(),
      userId: defaultUserId,
      title: 'Creative Writing Sprint',
      icon: '🎨',
      flavorText: 'Weave dreams into reality.',
      category: TaskCategory.CREATIVITY,
      difficulty: Difficulty.EASY,
      status: TaskStatus.ACTIVE,
      createdAt: new Date(Date.now() - 900000),
      completedAt: null,
    },
    {
      id: genObjectId(),
      userId: defaultUserId,
      title: 'Read 30 Pages of Lore',
      icon: '📚',
      flavorText: 'Knowledge is the greatest shield.',
      category: TaskCategory.INTELLECT,
      difficulty: Difficulty.MEDIUM,
      status: TaskStatus.COMPLETED,
      createdAt: new Date(Date.now() - 86400000 * 1 - 7200000),
      completedAt: new Date(Date.now() - 86400000 * 1),
    },
    {
      id: genObjectId(),
      userId: defaultUserId,
      title: 'Hydration 2L Challenge',
      icon: '💧',
      flavorText: 'Purity flowing through the veins.',
      category: TaskCategory.DISCIPLINE,
      difficulty: Difficulty.EASY,
      status: TaskStatus.COMPLETED,
      createdAt: new Date(Date.now() - 86400000 * 1 - 18000000),
      completedAt: new Date(Date.now() - 86400000 * 1 - 3600000),
    },
    {
      id: genObjectId(),
      userId: defaultUserId,
      title: 'Heavy Kettlebell Circuit',
      icon: '⚔️',
      flavorText: 'Forging an unbreakable vessel.',
      category: TaskCategory.STRENGTH,
      difficulty: Difficulty.HARD,
      status: TaskStatus.COMPLETED,
      createdAt: new Date(Date.now() - 86400000 * 2 - 14400000),
      completedAt: new Date(Date.now() - 86400000 * 2),
    },
    {
      id: genObjectId(),
      userId: defaultUserId,
      title: 'Evening Zen Meditation',
      icon: '🧘',
      flavorText: 'Stillness before the next dawn.',
      category: TaskCategory.DISCIPLINE,
      difficulty: Difficulty.EASY,
      status: TaskStatus.COMPLETED,
      createdAt: new Date(Date.now() - 86400000 * 2 - 7200000),
      completedAt: new Date(Date.now() - 86400000 * 2 - 1800000),
    },
    {
      id: genObjectId(),
      userId: defaultUserId,
      title: 'Cold Water Reset',
      icon: '⚡',
      flavorText: 'Sharp cold shocks the soul awake.',
      category: TaskCategory.DISCIPLINE,
      difficulty: Difficulty.EASY,
      status: TaskStatus.COMPLETED,
      createdAt: new Date(Date.now() - 86400000 * 3 - 21600000),
      completedAt: new Date(Date.now() - 86400000 * 3 - 14400000),
    },
    {
      id: genObjectId(),
      userId: defaultUserId,
      title: 'Trail Run & Woodland Sprint',
      icon: '🏃',
      flavorText: 'Running with the wind through the pines.',
      category: TaskCategory.STRENGTH,
      difficulty: Difficulty.HARD,
      status: TaskStatus.COMPLETED,
      createdAt: new Date(Date.now() - 86400000 * 4 - 28800000),
      completedAt: new Date(Date.now() - 86400000 * 4 - 7200000),
    },
    {
      id: genObjectId(),
      userId: defaultUserId,
      title: 'Master Class Coding Quest',
      icon: '💻',
      flavorText: 'Architecting complex distributed logic.',
      category: TaskCategory.INTELLECT,
      difficulty: Difficulty.EPIC,
      status: TaskStatus.COMPLETED,
      createdAt: new Date(Date.now() - 86400000 * 5 - 36000000),
      completedAt: new Date(Date.now() - 86400000 * 5 - 14400000),
    },
  ],
  transactions: [
    {
      id: genObjectId(),
      characterId: defaultCharId,
      type: TransactionType.EARN,
      amount: 100,
      reason: 'Starter adventurer gold',
      createdAt: new Date(),
    },
  ],
  shopItems: [
    {
      id: genObjectId(),
      name: "Traveler's Cloak",
      cost: 50,
      type: ShopItemType.THEME,
    },
    {
      id: genObjectId(),
      name: "Focus Hood",
      cost: 75,
      type: ShopItemType.FRAME,
    },
    {
      id: genObjectId(),
      name: "Scholar's Tome",
      cost: 100,
      type: ShopItemType.TITLE,
    },
    {
      id: genObjectId(),
      name: "Dragon Knight Frame",
      cost: 120,
      type: ShopItemType.FRAME,
    },
    {
      id: genObjectId(),
      name: "Midnight Obsidian Theme",
      cost: 150,
      type: ShopItemType.THEME,
    },
    {
      id: genObjectId(),
      name: "The Disciplined Title",
      cost: 80,
      type: ShopItemType.TITLE,
    },
  ],
  inventories: [],
};

// Model Helpers
export const memoryUser = {
  findUnique: async ({ where, include, select }: any) => {
    let u = null;
    if (where.email) {
      u = db.users.find((user) => user.email === where.email) || null;
    } else if (where.id) {
      u = db.users.find((user) => user.id === where.id) || null;
    }
    if (!u) return null;

    let res: any = { ...u };
    const wantsCharacter = include?.character || select?.character;
    if (wantsCharacter) {
      const char = db.characters.find((c) => c.userId === u.id);
      if (char) {
        const charObj: any = { ...char };
        const charOptions = typeof wantsCharacter === 'object' ? wantsCharacter : {};
        if (charOptions.include?.attributes || charOptions.select?.attributes) {
          charObj.attributes = db.attributes.filter((a) => a.characterId === char.id);
        }
        if (charOptions.include?.streak || charOptions.select?.streak) {
          charObj.streak = db.streaks.find((s) => s.characterId === char.id) || null;
        }
        res.character = charObj;
      } else {
        res.character = null;
      }
    }

    if (select) {
      const selected: any = {};
      for (const key of Object.keys(select)) {
        if (select[key]) {
          selected[key] = res[key];
        }
      }
      return selected;
    }

    return res;
  },
  create: async ({ data }: any) => {
    const user = {
      id: genObjectId(),
      email: data.email,
      passwordHash: data.passwordHash,
      displayName: data.displayName,
      avatarUrl: data.avatarUrl || '/avatars/paladin.jpg',
      createdAt: new Date(),
    };
    db.users.push(user);
    return user;
  },
  update: async ({ where, data, select, include }: any) => {
    const user = db.users.find((u) => u.id === where.id);
    if (!user) throw new Error('User not found');
    if (data.displayName !== undefined) user.displayName = data.displayName;
    if (data.avatarUrl !== undefined) user.avatarUrl = data.avatarUrl;
    return memoryUser.findUnique({ where, include, select });
  },
};

export const memoryCharacter = {
  findUnique: async ({ where, include }: any) => {
    let char = null;
    if (where.userId) {
      char = db.characters.find((c) => c.userId === where.userId) || null;
    } else if (where.id) {
      char = db.characters.find((c) => c.id === where.id) || null;
    }
    if (!char) return null;

    const result = { ...char };
    if (include?.attributes) {
      result.attributes = db.attributes.filter((a) => a.characterId === char.id);
    }
    if (include?.streak) {
      result.streak = db.streaks.find((s) => s.characterId === char.id) || null;
    }
    if (include?.transactions) {
      result.transactions = db.transactions.filter((t) => t.characterId === char.id);
    }
    if (include?.inventory) {
      result.inventory = db.inventories.filter((i) => i.characterId === char.id);
    }
    return result;
  },
  create: async ({ data }: any) => {
    const char = {
      id: genObjectId(),
      userId: data.userId,
      level: data.level ?? 1,
      currentXp: data.currentXp ?? 0,
      currencyBalance: data.currencyBalance ?? 0,
    };
    db.characters.push(char);
    return char;
  },
  update: async ({ where, data }: any) => {
    const char = db.characters.find((c) => c.id === where.id);
    if (!char) throw new Error('Character not found');

    if (data.level !== undefined) char.level = data.level;
    if (data.currentXp !== undefined) char.currentXp = data.currentXp;
    if (data.currencyBalance !== undefined) {
      if (typeof data.currencyBalance === 'object' && data.currencyBalance.decrement !== undefined) {
        char.currencyBalance -= data.currencyBalance.decrement;
      } else {
        char.currencyBalance = data.currencyBalance;
      }
    }
    return { ...char };
  },
};

export const memoryAttribute = {
  createMany: async ({ data }: any) => {
    for (const item of data) {
      db.attributes.push({
        id: genObjectId(),
        characterId: item.characterId,
        name: item.name,
        value: item.value ?? 0,
      });
    }
    return { count: data.length };
  },
  create: async ({ data }: any) => {
    const attr = {
      id: genObjectId(),
      characterId: data.characterId,
      name: data.name,
      value: data.value ?? 0,
    };
    db.attributes.push(attr);
    return attr;
  },
  findFirst: async ({ where }: any) => {
    return (
      db.attributes.find(
        (a) => a.characterId === where.characterId && a.name === where.name
      ) || null
    );
  },
  update: async ({ where, data }: any) => {
    const attr = db.attributes.find((a) => a.id === where.id);
    if (!attr) throw new Error('Attribute not found');
    if (data.value !== undefined) attr.value = data.value;
    return { ...attr };
  },
};

export const memoryStreak = {
  findUnique: async ({ where }: any) => {
    return db.streaks.find((s) => s.characterId === where.characterId) || null;
  },
  create: async ({ data }: any) => {
    const streak = {
      id: genObjectId(),
      characterId: data.characterId,
      currentStreak: data.currentStreak ?? 0,
      longestStreak: data.longestStreak ?? 0,
      lastActivityDate: data.lastActivityDate ?? null,
    };
    db.streaks.push(streak);
    return streak;
  },
  update: async ({ where, data }: any) => {
    let streak = db.streaks.find((s) => s.characterId === where.characterId || s.id === where.id);
    if (!streak) {
      streak = {
        id: genObjectId(),
        characterId: where.characterId,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
      };
      db.streaks.push(streak);
    }
    if (data.currentStreak !== undefined) streak.currentStreak = data.currentStreak;
    if (data.longestStreak !== undefined) streak.longestStreak = data.longestStreak;
    if (data.lastActivityDate !== undefined) streak.lastActivityDate = data.lastActivityDate;
    return { ...streak };
  },
};

export const memoryTask = {
  findMany: async ({ where, orderBy }: any = {}) => {
    let list = db.tasks;
    if (where?.userId) {
      list = list.filter((t) => t.userId === where.userId);
    }
    if (where?.status) {
      list = list.filter((t) => t.status === where.status);
    }
    if (orderBy?.createdAt === 'desc') {
      list = [...list].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    return list;
  },
  findUnique: async ({ where }: any) => {
    return db.tasks.find((t) => t.id === where.id) || null;
  },
  create: async ({ data }: any) => {
    const task = {
      id: genObjectId(),
      userId: data.userId,
      title: data.title,
      icon: data.icon ?? null,
      flavorText: data.flavorText ?? null,
      category: data.category,
      difficulty: data.difficulty,
      status: data.status ?? TaskStatus.ACTIVE,
      createdAt: new Date(),
      completedAt: null,
      reminderTime: data.reminderTime ?? null,
    };
    db.tasks.push(task);
    return task;
  },
  update: async ({ where, data }: any) => {
    const task = db.tasks.find((t) => t.id === where.id);
    if (!task) throw new Error('Task not found');
    if (data.title !== undefined) task.title = data.title;
    if (data.category !== undefined) task.category = data.category;
    if (data.difficulty !== undefined) task.difficulty = data.difficulty;
    if (data.icon !== undefined) task.icon = data.icon;
    if (data.reminderTime !== undefined) task.reminderTime = data.reminderTime;
    if (data.flavorText !== undefined) task.flavorText = data.flavorText;
    if (data.status !== undefined) task.status = data.status;
    if (data.completedAt !== undefined) task.completedAt = data.completedAt;
    return { ...task };
  },
  delete: async ({ where }: any) => {
    const idx = db.tasks.findIndex((t) => t.id === where.id);
    if (idx !== -1) {
      db.tasks.splice(idx, 1);
    }
    return { success: true };
  },
};

export const memoryTransaction = {
  create: async ({ data }: any) => {
    const tx = {
      id: genObjectId(),
      characterId: data.characterId,
      type: data.type,
      amount: data.amount,
      reason: data.reason,
      createdAt: new Date(),
    };
    db.transactions.push(tx);
    return tx;
  },
};

export const memoryShopItem = {
  findMany: async () => {
    return [...db.shopItems].sort((a, b) => a.cost - b.cost);
  },
  findUnique: async ({ where }: any) => {
    return db.shopItems.find((s) => s.id === where.id) || null;
  },
  findFirst: async ({ where }: any) => {
    if (where.name) return db.shopItems.find((s) => s.name === where.name) || null;
    return db.shopItems[0] || null;
  },
  create: async ({ data }: any) => {
    const item = {
      id: genObjectId(),
      name: data.name,
      cost: data.cost,
      type: data.type,
    };
    db.shopItems.push(item);
    return item;
  },
};

export const memoryInventory = {
  findFirst: async ({ where }: any) => {
    const item = db.inventories.find(
      (i) => i.characterId === where.characterId && i.shopItemId === where.shopItemId
    );
    return item || null;
  },
  create: async ({ data, include }: any) => {
    const inv = {
      id: genObjectId(),
      characterId: data.characterId,
      shopItemId: data.shopItemId,
      acquiredAt: new Date(),
    };
    db.inventories.push(inv);

    const result: any = { ...inv };
    if (include?.shopItem) {
      result.shopItem = db.shopItems.find((s) => s.id === data.shopItemId) || null;
    }
    return result;
  },
};

export const memoryDbClient = {
  user: memoryUser,
  character: memoryCharacter,
  attribute: memoryAttribute,
  task: memoryTask,
  streak: memoryStreak,
  transaction: memoryTransaction,
  shopItem: memoryShopItem,
  inventory: memoryInventory,
  $transaction: async (fn: (tx: any) => Promise<any>) => {
    return await fn(memoryDbClient);
  },
};
