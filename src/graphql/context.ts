import { PrismaClient } from "@prisma/client";
import { IncomingMessage } from "node:http";
import { Context } from "@/shared/types";
import { getUserId } from "@/jwt";

// Instantiate Prisma Client
const prisma = new PrismaClient();

// Context function to be passed to Apollo Server
export const createContext = ({ req }: { req: IncomingMessage }): Context => {
  const userId = getUserId(req);

  return {
    prisma,
    userId: userId ?? undefined,
  };
};
