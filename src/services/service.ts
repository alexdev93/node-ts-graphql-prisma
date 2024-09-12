import { Context, Post, User } from "../shared";
import bcrypt from "bcryptjs";
import jwt from "jwt-simple";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY: any = process.env.JWT_SECRET;

export const getUsers = async (_: any, __: any, { prisma }: Context) =>
  prisma.user.findMany();

export const getPosts = async (_: any, __: any, { prisma }: Context) =>
  prisma.post.findMany({ include: { author: true } });

export const signUp = async (
  _parent: unknown,
  { email, password }: Pick<User, "email" | "password">,
  { prisma }: Context
): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  const token = jwt.encode({ userId: newUser.id }, SECRET_KEY);
  return token;
};

export const signIn = async (
  { email, password }: Pick<User, "email" | "password">,
  { prisma }: Context
) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    throw new Error("Invalid password");
  }

  const token = jwt.encode({ userId: user.id }, SECRET_KEY);
  return token;
};

export const createPost = async (
  _parent: unknown,
  { title, content }: Omit<Post, "id" | "author">,
  { prisma, userId }: Context
) => {
  if (!userId) {
    throw new Error("You must be logged in to create a post");
  }

  const newPost = await prisma.post.create({
    data: { title, content, authorId: userId },
    include: { author: true },
  });

  return newPost;
};
