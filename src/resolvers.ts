import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jwt-simple";

const prisma = new PrismaClient();
const SECRET_KEY: any = process.env.JWT_SECRET;

export const resolvers = {
  Query: {
    users: async () => await prisma.user.findMany(),
    posts: async () => await prisma.post.findMany(),
  },
  Mutation: {
    signUp: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword },
      });
      const token = jwt.encode({ userId: user.id }, SECRET_KEY);
      return token;
    },
    createPost: async (
      _: any,
      { title, content }: { title: string; content: string },
      context: any
    ) => {
      const token = context.token;
      if (!token) throw new Error("Not authenticated");

      const decoded = jwt.decode(token, SECRET_KEY);
      const userId = decoded.userId;

      return await prisma.post.create({
        data: { title, content, authorId: userId },
      });
    },
  },
};
