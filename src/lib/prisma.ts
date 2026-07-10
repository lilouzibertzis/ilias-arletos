import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Prisma 7 uses the query compiler + a driver adapter. We connect to Neon
// Postgres through node-postgres (`pg`), which works locally and on Vercel.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Avoid instantiating a new client on every HMR reload in development.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
