import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { prismaClient } from "store/client";

interface AUTH_PAYLOAD extends JwtPayload {
  id: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token ?? "";
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token Not Found",
      });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as AUTH_PAYLOAD;

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const existingUser = await prismaClient.user.findFirst({
      where: {
        id: decoded.id ?? "",
      },
    });

    if (!existingUser) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    req.userId = decoded.id;
    req.user = existingUser;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Authentication Failed",
    });
  }
};
