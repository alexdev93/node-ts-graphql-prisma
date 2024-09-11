import bcrypt from "bcryptjs";
import jwt from "jwt-simple";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { Context, Post, User } from "./types";
dotenv.config();

const SECRET_KEY: any = process.env.JWT_SECRET;

export const resolvers = {

  Query: {
    users: async (_: any, __: any, { prisma }: Context) => {
      return await prisma.user.findMany();
    },
    posts: async (_: any, __: any, { prisma }: Context) => {
      return await prisma.post.findMany({ include: { author: true } });
    },
  },

  Mutation: {

    signUp: async (
      _: any,
      { email, password }: User,
      { prisma }: Context
    ) => {
      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: { email, password: hashedPassword },
        });

        const token = jwt.encode({ userId: user.id }, SECRET_KEY);
        return token;
      }

      throw new Error("Email is already in use");
    },

    signIn: async (
      _: any,
      { email, password }: User,
      { prisma }: Context
    ) => {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error("Invalid email or password");
      }

      const token = jwt.encode({ userId: user.id }, SECRET_KEY);
      return token;
    },

    createPost: async (
      _: any,
      { title, content }: Post,
      { prisma, userId }: Context
    ) => {
      if (!userId) throw new Error("Not authenticated");

      return await prisma.post.create({
        data: { title, content, authorId: userId },
        include: { author: true },
      });
    },
    
  },
};
