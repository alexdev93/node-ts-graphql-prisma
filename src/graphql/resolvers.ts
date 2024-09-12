
import dotenv from "dotenv";
dotenv.config();
import { createPost, getPosts, getUsers, signIn, signUp } from "../services/user/service";

export const SECRET_KEY: any = process.env.JWT_SECRET;

export const resolvers = {
  Query: {
    users: getUsers,
    posts: getPosts,
  },

  Mutation: {
    signUp: signUp,
    signIn: signIn,
    createPost: createPost,
  },
};
