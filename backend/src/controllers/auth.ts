import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TaskCategory } from '@prisma/client';
import prisma from '../utils/db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-access-super-secret-key-32-chars-min';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-super-secret-key-32-chars-min';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const ALL_CATEGORIES: TaskCategory[] = [
  TaskCategory.INTELLECT,
  TaskCategory.STRENGTH,
  TaskCategory.DISCIPLINE,
  TaskCategory.CREATIVITY,
];

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  return { accessToken, refreshToken };
};

const setRefreshCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: REFRESH_COOKIE_MAX_AGE,
    path: '/',
  });
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, displayName } = req.body;

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          displayName: displayName.trim(),
        },
      });

      const character = await tx.character.create({
        data: {
          userId: user.id,
          level: 1,
          currentXp: 0,
          currencyBalance: 0,
        },
      });

      await tx.attribute.createMany({
        data: ALL_CATEGORIES.map((cat) => ({
          characterId: character.id,
          name: cat,
          value: 0,
        })),
      });

      await tx.streak.create({
        data: {
          characterId: character.id,
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: null,
        },
      });

      return user;
    });

    const { accessToken, refreshToken } = generateTokens(newUser.id);
    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      accessToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to complete registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    setRefreshCookie(res, refreshToken);

    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to process login' });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token cookie missing' });
      return;
    }

    let payload: { id: string };
    try {
      payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string };
    } catch {
      res.status(401).json({ error: 'Invalid or expired refresh token' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      res.status(401).json({ error: 'User no longer exists' });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
    setRefreshCookie(res, newRefreshToken);

    res.json({ accessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
  res.json({ success: true, message: 'Logged out successfully' });
};
