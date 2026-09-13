import { PrismaClient } from '@prisma/client';
import { memoryDbClient } from './memoryStore';

const dbUrl = process.env.DATABASE_URL || '';
const isPlaceholder = !dbUrl || dbUrl.includes('username:password');

let prisma: any;

if (isPlaceholder || process.env.USE_MEMORY_DB === 'true') {
  console.log('[Database] Using InMemory database store (seeded with Basudev hero@liferpg.com)');
  prisma = memoryDbClient;
} else {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export default prisma;
