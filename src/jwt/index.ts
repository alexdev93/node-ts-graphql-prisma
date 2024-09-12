import { IncomingMessage } from "node:http";
import jwt from "jwt-simple";

const getTokenFromAuthorizationHeader = (
  request: IncomingMessage
): string | null => {
  const authorizationHeader = request.headers.authorization;

  if (authorizationHeader) {
    return authorizationHeader.replace("Bearer ", "");
  }

  return null;
};

const getUserIdFromToken = (token: string): number | null => {
  try {
    const decodedToken = jwt.decode(token, process.env.JWT_SECRET as string);
    return decodedToken.userId as number;
  } catch {
    return null;
  }
};

export const getUserId = (request: IncomingMessage): number | null => {
  const token = getTokenFromAuthorizationHeader(request);
  if (token) {
    return getUserIdFromToken(token);
  }

  return null;
};
