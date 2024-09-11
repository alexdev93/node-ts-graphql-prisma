import { PrismaClient } from "@prisma/client";
import jwt from "jwt-simple";
import { IncomingMessage } from "node:http";
import { Context } from "./types";

// Instantiate Prisma Client
const prisma = new PrismaClient();

// Helper function to extract userId from JWT token using jwt-simple
const getUserId = (req: IncomingMessage): number | null => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Extract token from the "Bearer <token>" format
    const token = authHeader.replace("Bearer ", "");

    try {
      // Decode the JWT using jwt-simple and the secret key
      const decodedToken = jwt.decode(token, process.env.JWT_SECRET as string);
      const userId: number = decodedToken.userId;
      return userId;
    } catch (err) {
      console.error("Invalid token:", err);
      return null;
    }
  }

  return null;
};

// Context function to be passed to Apollo Server
export const createContext = ({ req }: { req: IncomingMessage }): Context => {
  const userId = getUserId(req); 

  return {
    prisma,
    userId, // This will be undefined for unauthenticated requests
  };
};
