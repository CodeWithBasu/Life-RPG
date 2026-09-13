import { PrismaClient } from '@prisma/client';
import net from 'net';
import { memoryDbClient } from './memoryStore';

let useMemory = false;
let realPrisma: PrismaClient | null = null;

// Probe localhost:27017 immediately via raw TCP with a 300ms threshold
export const checkMongoPort = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(300);

    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(27017, '127.0.0.1');
  });
};

(async () => {
  const isMongoOpen = await checkMongoPort();
  if (isMongoOpen) {
    try {
      realPrisma = new PrismaClient({ log: ['warn', 'error'] });
      await realPrisma.$connect();
      console.log('✔ Connected to MongoDB replica set via Prisma ORM');
      return;
    } catch {
      // Fall through to memory
    }
  }

  console.log('⚡ MongoDB not detected on localhost:27017. Engaging in-memory game database.');
  useMemory = true;
})();

const dbProxy = new Proxy({} as any, {
  get(_target, prop: string) {
    if (prop === '$transaction') {
      return async (fnOrArray: any) => {
        if (!useMemory && realPrisma) {
          try {
            return await realPrisma.$transaction(fnOrArray);
          } catch {
            useMemory = true;
            return await memoryDbClient.$transaction(fnOrArray);
          }
        }
        return await memoryDbClient.$transaction(fnOrArray);
      };
    }

    if (prop === '$connect' || prop === '$disconnect') {
      return async () => {};
    }

    return new Proxy({} as any, {
      get(_t, action: string) {
        return async (...args: any[]) => {
          if (!useMemory && realPrisma && (realPrisma as any)[prop]) {
            try {
              return await (realPrisma as any)[prop][action](...args);
            } catch {
              useMemory = true;
              return await (memoryDbClient as any)[prop][action](...args);
            }
          }
          return await (memoryDbClient as any)[prop][action](...args);
        };
      },
    });
  },
});

export default dbProxy as PrismaClient;
