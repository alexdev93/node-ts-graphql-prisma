import { PrismaClient } from "@prisma/client";

export interface Context {
  prisma: PrismaClient;
  userId?: number | null; // Optional, because it will only exist for authenticated users
}

export interface Post {
  title: string;
  content: string;
}

export interface User {
  email: string;
  password: string;
}