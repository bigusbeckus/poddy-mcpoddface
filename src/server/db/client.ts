import { dbLogger } from "@/utils/logger";
import { type Prisma, PrismaClient } from "@prisma/client";
import { env } from "src/env.mjs";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel> | undefined;
}

const devLevels: readonly Prisma.LogLevel[] = ["query", "error", "warn"] as const;
const prodLevels: readonly Prisma.LogLevel[] = ["error"] as const;

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: (env.NODE_ENV === "development" ? devLevels : prodLevels).map((level) => ({
      emit: "event",
      level,
    })),
  });

prisma.$on("query", (e) => {
  const message = `Query started:\n  ${e.query}\n  Completed in ${e.duration}ms at ${e.timestamp}`;
  dbLogger.info(message);
});

prisma.$on("error", (e) => {
  const message = `Prisma error: ${e.message}\n  ${e.target} at ${e.timestamp}`;
  dbLogger.error(message);
});

prisma.$on("warn", (e) => {
  const message = `Prisma warning: ${e.message} at ${e.timestamp}`;
  dbLogger.warn(message);
});

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
