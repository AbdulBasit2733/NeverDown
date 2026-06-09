import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../config";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const cookieToken = req.cookies?.accessToken;
  const authHeader = req.headers.authorization;
  const bearerToken =
    authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  const token = bearerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No access token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded)
    ) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid token payload" });
    }

    req.userId = (decoded as { userId: string }).userId;
    next();
  } catch {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid or expired token" });
  }
};