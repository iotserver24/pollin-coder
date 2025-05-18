import { PrismaClient } from '@prisma/client';

// This prevents multiple instances of Prisma Client in development
declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

// Check if we're in development or test environment
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Use cached instance in development to prevent too many connections
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({
      // Enable mock mode if we're running tests or have connection issues
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;

// Gracefully shutdown the database connection
export function disconnectDb() {
  if (prisma) return prisma.$disconnect();
} 