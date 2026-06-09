import type { NextFunction, Request, Response } from "express";

export const internalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const secret = req.headers["x-internal-secret"];
  const userId = req.headers["x-user-id"];

  if (secret !== process.env.INTERNAL_API_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Missing user id" });
  }

  req.userId = userId;
  next();
};
