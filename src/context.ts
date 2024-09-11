import { PrismaClient } from "@prisma/client";
import jwt from "jwt-simple";
import { Request } from "express";

// Instantiate Prisma Client
const prisma = new PrismaClient();

// Interface to define the shape of the context object
export interface Context {
  prisma: PrismaClient;
  userId?: string | null; // Optional, because it will only exist for authenticated users
}

// Helper function to extract userId from JWT token using jwt-simple
const getUserId = (req: Request): string | null => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Extract token from the "Bearer <token>" format
    const token = authHeader.replace("Bearer ", "");

    try {
      // Decode the JWT using jwt-simple and the secret key
      const decodedToken = jwt.decode(token, process.env.JWT_SECRET as string);

      // Assuming the token contains a userId field
      return decodedToken.userId;
    } catch (err) {
      console.error("Invalid token:", err);
      return null;
    }
  }

  return null;
};

// Context function to be passed to Apollo Server
export const createContext = ({ req }: { req: Request }): Context => {
  const userId = getUserId(req); // Extract userId if token exists and is valid

  return {
    prisma,
    userId, // This will be undefined for unauthenticated requests
  };
};
