// rate-limiter.ts
import rateLimit from "express-rate-limit";

/**
 * Strict limiter specifically for sensitive authentication endpoints.
 * Protects against brute-force attacks on signup/signin.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
  standardHeaders: "draft-7", // Return standard rate limit info headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
});

/**
 * General API limiter for authenticated application routes.
 * Balanced to prevent automated scraping or abuse while serving normal usage.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again later.",
  },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});