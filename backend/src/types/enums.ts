export const TaskCategory = {
  INTELLECT: 'INTELLECT',
  STRENGTH: 'STRENGTH',
  DISCIPLINE: 'DISCIPLINE',
  CREATIVITY: 'CREATIVITY',
} as const;
export type TaskCategory = (typeof TaskCategory)[keyof typeof TaskCategory];

export const Difficulty = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
  EPIC: 'EPIC',
} as const;
export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export const TaskStatus = {
  TODO: 'TODO',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const ShopItemType = {
  AVATAR: 'AVATAR',
  THEME: 'THEME',
  TITLE: 'TITLE',
  FRAME: 'FRAME',
  BADGE: 'BADGE',
} as const;
export type ShopItemType = (typeof ShopItemType)[keyof typeof ShopItemType];

export const TransactionType = {
  EARN: 'EARN',
  SPEND: 'SPEND',
} as const;
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];
