/* eslint-disable @typescript-eslint/no-explicit-any */

// Prisma v7 + Neon Serverless Adapter
// Uses @neondatabase/serverless Pool with @prisma/adapter-neon for Prisma 7.
// Type assertion used because @prisma/adapter-neon and @neondatabase/serverless
// have mismatched type definitions in this version combo but work at runtime.

import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
const { PrismaClient } = require('@prisma/client') as any;

const globalForPrisma = globalThis as unknown as {
    prisma: any;
};

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);

    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
